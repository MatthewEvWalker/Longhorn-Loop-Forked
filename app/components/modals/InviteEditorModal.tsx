// "Invite Editor?" / "Invite Admin?" — invite a UT user by email as an editor
// or an admin of an organization, then swap to the "Invite sent!" confirmation
// (LOOP-182).
//
// Figma: node 2723:5645 ("Jayna Invite editor"), reviewed 2026-06-08. The
// Editor / Admin toggle is not in that frame. The modal used to send the email
// alone, the server defaulted the role to editor, and the only way to add a
// co-admin was invite -> wait for them to join -> tap the role swap on the
// Members tab. POST /orgs/:id/invites already accepted `role: 'admin'`, so this
// just exposes it.
//
// The screen still owns the mutation through `onInvite`.

import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { isAllowedUTEmail } from '@/shared/utEmail';
import LhlSearchIcon from '@/assets/icons/LhlSearchIcon';
import TextInputField from '@/app/components/inputs/TextInputField';

import ProfileModal, { ModalAction } from './ProfileModal';

/** Editors must be UT people, so only utexas.edu addresses are invitable. */
// LOOP-255: replaced a local any-subdomain regex with the shared allow-list.
// Inviting an address that can't receive a sign-in code would create a
// membership row nobody can ever claim.

export function isUtEmail(value: string): boolean {
  return isAllowedUTEmail(value);
}

/** Mirrors the org_invites.role CHECK and OrgRole in server/src/lib/orgInvites.ts. */
export type InviteRole = 'editor' | 'admin';

// Editor is first and the default: admin can invite, change roles and remove
// people, so granting it should be a deliberate tap, never what you get by not
// looking at the toggle.
const ROLE_OPTIONS: { value: InviteRole; label: string; hint: string }[] = [
  { value: 'editor', label: 'Editor', hint: 'Can post and edit events.' },
  { value: 'admin', label: 'Admin', hint: 'Can also invite, change roles, and remove members.' },
];

export interface InviteEditorModalProps {
  visible: boolean;
  /** Sends the invite. Reject to surface an inline error and stay on the form. */
  onInvite: (email: string, role: InviteRole) => Promise<void>;
  onClose: () => void;
}

export default function InviteEditorModal({ visible, onInvite, onClose }: InviteEditorModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<InviteRole>('editor');
  const [stage, setStage] = useState<'form' | 'sent'>('form');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset every time the modal opens so a previous invite never leaks through
  // -- the role especially: reopening on "Admin" would make the next invite an
  // admin one without anyone choosing that.
  useEffect(() => {
    if (visible) {
      setEmail('');
      setRole('editor');
      setStage('form');
      setIsSending(false);
      setError(null);
    }
  }, [visible]);

  const handleSend = useCallback(async () => {
    const trimmed = email.trim();
    if (!isUtEmail(trimmed)) {
      setError('Enter a valid UT email address.');
      return;
    }

    setIsSending(true);
    setError(null);
    try {
      await onInvite(trimmed, role);
      setStage('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'That invite could not be sent.');
    } finally {
      setIsSending(false);
    }
  }, [email, role, onInvite]);

  const title = role === 'admin' ? 'Invite Admin?' : 'Invite Editor?';

  if (stage === 'sent') {
    return (
      <ProfileModal
        visible={visible}
        onDismiss={onClose}
        title={title}
        showIconPlaceholder
        actions={
          <ModalAction label="Done" variant="ink" size="large" fullWidth onPress={onClose} />
        }
      >
        <View className="flex-row items-center gap-[10px]">
          <View className="h-[32px] w-[32px] rounded-full bg-lhlPlaceholderGrey" />
          <View className="flex-1">
            <Text className="font-['Roboto-Flex'] text-[11px] font-semibold text-lhlInk">
              Invite sent!
            </Text>
            <Text className="font-['Roboto-Flex'] mt-[2px] text-[11px] text-lhlSecondaryTextGrey">
              They&apos;ll receive an email with next steps.
            </Text>
          </View>
        </View>
      </ProfileModal>
    );
  }

  return (
    <ProfileModal
      visible={visible}
      onDismiss={onClose}
      dismissOnBackdropPress={!isSending}
      title={title}
      showIconPlaceholder
      body={`Search for a user to invite as ${role === 'admin' ? 'an admin' : 'an editor'} to your organization`}
      actions={
        <>
          <ModalAction label="Cancel" variant="outline" onPress={onClose} disabled={isSending} />
          <ModalAction
            label={isSending ? 'Sending…' : 'Send'}
            variant="ink"
            onPress={handleSend}
            disabled={isSending || email.trim().length === 0}
          />
        </>
      }
    >
      <TextInputField
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (error) setError(null);
        }}
        placeholder="Search by UT email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        borderRadius={8}
        editable={!isSending}
        onSubmitEditing={handleSend}
        leftIcon={<LhlSearchIcon size={15} color="#000000" />}
      />

      {/* Same segmented control as Settings > Appearance. */}
      <View
        accessibilityRole="radiogroup"
        className="mt-[10px] flex-row rounded-[10px] bg-lhlSegmentTrack p-[3px]"
      >
        {ROLE_OPTIONS.map((option) => {
          const isActive = role === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => setRole(option.value)}
              disabled={isSending}
              accessibilityRole="radio"
              accessibilityState={{ selected: isActive, disabled: isSending }}
              accessibilityLabel={`Invite as ${option.label}`}
              accessibilityHint={option.hint}
              className={`flex-1 items-center rounded-[8px] py-[8px] ${
                isActive ? 'bg-lhlSurface' : ''
              }`}
            >
              <Text
                className={`font-['Roboto-Flex'] text-[12.5px] ${
                  isActive ? 'font-semibold text-lhlInk' : 'text-lhlSecondaryTextGrey'
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text className="font-['Roboto-Flex'] mt-[6px] text-center text-[11px] text-lhlSecondaryTextGrey">
        {ROLE_OPTIONS.find((o) => o.value === role)?.hint}
      </Text>

      {error ? (
        <Text className="font-['Roboto-Flex'] mt-[6px] text-center text-[11px] text-lhlDestructiveRed">
          {error}
        </Text>
      ) : null}
    </ProfileModal>
  );
}
