/**
 * The create-event → org-console write path (LOOP-281), exercised against a
 * real SQLite database built from server/schema.sql.
 *
 * An org admin posted an event and it never appeared on the org management
 * page. The row wrote fine — it showed up under Posted on the poster's own
 * profile — so the failure was attribution, not the insert: the create wizard
 * asks who is posting in step 1, but the request carried no poster at all, and
 * POST /events/create never named `host_organization_id` in its INSERT.
 * GET /orgs/:orgId/events filters on that one column, so an org-posted event
 * went in with a NULL org and the console that exists to manage it was
 * looking for rows that could not exist.
 *
 * Three things are worth pinning here and nowhere else:
 *
 *   1. The regression itself — an event inserted WITHOUT the column is
 *      invisible to the console query. That is the bug, stated as a test, and
 *      it is what a future refactor of the INSERT column list would break.
 *   2. The membership check that gates the new column. It is what stops any
 *      authenticated user attributing an event to any org by id, which would
 *      put a post on a real org's public profile.
 *   3. That the FK actually holds, so a bad id fails loudly at the database
 *      rather than writing a dangling attribution.
 *
 * Query strings are duplicated from the routes because the routes build them
 * against a D1Database binding that only exists in the Worker runtime. If you
 * change the route SQL, change it here — drift shows up as a failure. Same
 * convention as test_org_console_sql.ts.
 *
 * Skips below Node 22 (node:sqlite). CI runs Node 20 and does not run this
 * suite; this is a local guard.
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

let DatabaseSync: (new (path: string) => any) | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ({ DatabaseSync } = require('node:sqlite'));
} catch {
  DatabaseSync = null;
}

const ORG = 100;
const OTHER_ORG = 200;
const ADMIN = 1;
const EDITOR = 2;
const OUTSIDER = 3;

const describeOrSkip = DatabaseSync ? describe : describe.skip;

describeOrSkip('org event attribution (LOOP-281)', () => {
  let db: any;

  /**
   * The membership lookup from resolveHostOrganization() in
   * routes/events.worker.ts. Returns the org's canonical name, which is what
   * gets denormalized onto host_organization_name — the client's copy comes
   * from a cached /orgs/mine response and would go stale on a rename.
   */
  const resolveHostOrg = (orgId: number, userId: number): { id: number; name: string } | null =>
    db
      .prepare(
        `SELECT o.id AS id, o.name AS name
           FROM org_members m
           JOIN organizations o ON o.id = m.org_id
          WHERE m.org_id = ? AND m.user_id = ?`,
      )
      .get(orgId, userId) ?? null;

  /** The console's list, reduced to the filter that was dropping rows. */
  const consoleEventIds = (orgId: number): number[] =>
    db
      .prepare(
        `SELECT e.id FROM events e
          WHERE e.host_organization_id = ?
            AND e.is_archived = 0
          ORDER BY e.id`,
      )
      .all(orgId)
      .map((row: { id: number }) => row.id);

  /** The poster's own Posted grid, which never depended on the org column. */
  const myPostedEventIds = (userId: number): number[] =>
    db
      .prepare('SELECT id FROM events WHERE created_by_user_id = ? ORDER BY id')
      .all(userId)
      .map((row: { id: number }) => row.id);

  const insertEvent = (id: number, createdBy: number, hostOrgId: number | null, hostName: string) =>
    db
      .prepare(
        `INSERT INTO events
           (id, source, source_event_id, title, start_datetime, end_datetime,
            host_organization_id, host_organization_name, created_by_user_id)
         VALUES (?, 'user', ?, ?, '2026-09-20T18:00:00', '2026-09-20T20:00:00', ?, ?, ?)`,
      )
      .run(id, `user-${createdBy}-${id}`, 'Gong Cha Coffee Chat', hostOrgId, hostName, createdBy);

  beforeEach(() => {
    db = new DatabaseSync!(':memory:');
    db.exec('PRAGMA foreign_keys = ON');
    db.exec(readFileSync(join(__dirname, '..', 'schema.sql'), 'utf-8'));

    db.exec(`INSERT INTO users (id, email, first_name, last_name) VALUES
      (${ADMIN}, 'admin@utexas.edu', 'Kamsi', 'Admin'),
      (${EDITOR}, 'editor@utexas.edu', 'Eli', 'Editor'),
      (${OUTSIDER}, 'nobody@utexas.edu', 'No', 'Body')`);

    db.exec(`INSERT INTO organizations (id, name) VALUES
      (${ORG}, 'Longhorn Devs'), (${OTHER_ORG}, 'Unrelated Org')`);

    db.exec(`INSERT INTO org_members (org_id, user_id, role) VALUES
      (${ORG}, ${ADMIN}, 'admin'),
      (${ORG}, ${EDITOR}, 'editor'),
      (${OTHER_ORG}, ${OUTSIDER}, 'admin')`);
  });

  describe('the regression', () => {
    it('hides an event from the console when host_organization_id is NULL', () => {
      // Exactly what the old INSERT produced: the row exists, is attributed to
      // the person, and the org query cannot see it.
      insertEvent(10, ADMIN, null, 'Kamsi Admin');

      expect(myPostedEventIds(ADMIN)).toEqual([10]);
      expect(consoleEventIds(ORG)).toEqual([]);
    });

    it('shows the event once the org column is written', () => {
      insertEvent(10, ADMIN, ORG, 'Longhorn Devs');

      expect(consoleEventIds(ORG)).toEqual([10]);
      // Still the poster's own event — the fix adds an attribution, it does
      // not move the event off their profile.
      expect(myPostedEventIds(ADMIN)).toEqual([10]);
    });

    it('does not leak an org-posted event into another org console', () => {
      insertEvent(10, ADMIN, ORG, 'Longhorn Devs');
      expect(consoleEventIds(OTHER_ORG)).toEqual([]);
    });

    it('keeps an archived event out of the console', () => {
      // is_archived is the cleanup job's soft delete, not something a manager
      // acts on — the org filter must not resurrect one.
      insertEvent(10, ADMIN, ORG, 'Longhorn Devs');
      db.prepare('UPDATE events SET is_archived = 1 WHERE id = ?').run(10);
      expect(consoleEventIds(ORG)).toEqual([]);
    });
  });

  describe('membership check on host_organization_id', () => {
    it('resolves an admin and an editor to the org, with its canonical name', () => {
      // Both roles may post: `editor` exists to let someone publish without
      // being handed membership control.
      expect(resolveHostOrg(ORG, ADMIN)).toMatchObject({ id: ORG, name: 'Longhorn Devs' });
      expect(resolveHostOrg(ORG, EDITOR)).toMatchObject({ id: ORG, name: 'Longhorn Devs' });
    });

    it('refuses a user who is not a member of that org', () => {
      // Being an admin of OTHER_ORG grants nothing here — otherwise any
      // authenticated user could post onto any org's public profile.
      expect(resolveHostOrg(ORG, OUTSIDER)).toBeNull();
      expect(resolveHostOrg(OTHER_ORG, OUTSIDER)).toMatchObject({ id: OTHER_ORG });
    });

    it('refuses an org id that does not exist', () => {
      expect(resolveHostOrg(999, ADMIN)).toBeNull();
    });

    it('returns the current name after a rename, not a cached one', () => {
      db.prepare('UPDATE organizations SET name = ? WHERE id = ?').run('Longhorn Loop', ORG);
      expect(resolveHostOrg(ORG, ADMIN)).toMatchObject({ name: 'Longhorn Loop' });
    });
  });

  describe('the FK behind the column', () => {
    it('rejects an attribution to a non-existent org', () => {
      expect(() => insertEvent(10, ADMIN, 999, 'Ghost Org')).toThrow();
    });
  });
});
