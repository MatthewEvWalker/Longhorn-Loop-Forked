/**
 * Server-side taxonomy data — bucket IDs, labels, and tags.
 *
 * This file is a copy of shared/taxonomy.ts, kept inside server/src/ so
 * the server's TypeScript project (rootDir: "./src") can import it without
 * crossing directory boundaries.
 *
 * KEEP IN SYNC with shared/taxonomy.ts.
 * The vitest test server/test/taxonomy.test.ts enforces this — it imports
 * from BOTH files and fails if the bucket lists diverge.
 *
 * Server imports: import { TAXONOMY_BUCKETS } from './lib/taxonomy'
 */

export type TaxonomyBucket = {
  /** Stable snake_case ID — used as a foreign key in event_tags.bucket_id */
  id: string;
  /** Human-readable label */
  label: string;
  /** Child tags belonging to this bucket */
  tags: string[];
};

export const TAXONOMY_BUCKETS: TaxonomyBucket[] = [
  {
    id: 'music',
    label: 'Music',
    tags: [
      'Rock & Alternative',
      'Hip Hop & Rap',
      'Electronic & EDM',
      'Country & Folk',
      'Jazz & Blues',
      'Classical & Opera',
      'Pop & Top 40',
      'R&B & Soul',
      'Indie & Underground',
      'Latin & Reggaeton',
      'K-Pop & J-Pop',
    ],
  },
  {
    id: 'arts',
    label: 'Arts & Culture',
    tags: [
      'Art Exhibitions & Galleries',
      'Theater & Broadway',
      'Dance Performances',
      'Film & Cinema',
      'Photography',
      'Sculpture & Installation Art',
      'Poetry & Spoken Word',
      'Street Art & Graffiti',
      'Cultural Festivals',
      'Museum Tours',
      'Anime',
    ],
  },
  {
    id: 'sports',
    label: 'Sports & Fitness',
    tags: [
      'Football & Soccer',
      'Basketball',
      'Baseball & Softball',
      'Tennis & Racquet Sports',
      'Running & Marathon',
      'Yoga & Meditation',
      'Cycling & Biking',
      'Swimming & Water Sports',
      'Martial Arts & Boxing',
      'Extreme Sports',
      'Golf',
      'CrossFit & HIIT',
    ],
  },
  {
    id: 'food',
    label: 'Food & Drink',
    tags: [
      'Wine Tasting',
      'Craft Beer & Breweries',
      'Cocktails & Mixology',
      'Fine Dining',
      'Street Food & Food Trucks',
      'Vegan & Vegetarian',
      'Coffee & Tea',
      'Baking & Pastries',
      'International Cuisine',
      'Cooking Classes',
      'Food Festivals',
    ],
  },
  {
    id: 'tech',
    label: 'Technology & Innovation',
    tags: [
      'Startup & Entrepreneurship',
      'AI & Machine Learning',
      'Blockchain & Crypto',
      'Web Development',
      'Mobile Apps',
      'Cybersecurity',
      'Gaming & Esports',
      'VR & AR',
      'Robotics',
      'Tech Conferences',
      'Hackathons',
    ],
  },
  {
    id: 'learning',
    label: 'Learning & Education',
    tags: [
      'Workshops & Seminars',
      'Language Learning',
      'Personal Development',
      'Career & Professional Growth',
      'Science & Research',
      'History & Archaeology',
      'Book Clubs',
      'Study Groups',
      'Online Courses',
      'Academic Lectures',
      'Undergraduate Research',
    ],
  },
  {
    id: 'outdoors',
    label: 'Outdoors & Nature',
    tags: [
      'Hiking & Trekking',
      'Camping',
      'Rock Climbing',
      'Kayaking & Canoeing',
      'Wildlife & Bird Watching',
      'Gardening',
      'Beach Activities',
      'Fishing',
      'Environmental Conservation',
    ],
  },
  {
    id: 'gaming',
    label: 'Gaming & Entertainment',
    tags: [
      'Video Gaming',
      'Board Games & Tabletop',
      'Card Games',
      'Esports Tournaments',
      'Virtual Reality Gaming',
      'Retro Gaming',
      'Role-Playing Games (RPG)',
      'Trivia Nights',
      'Escape Rooms',
      'Comedy Shows',
    ],
  },
  {
    id: 'social',
    label: 'Social & Networking',
    tags: [
      'Meetups & Mixers',
      'Speed Networking',
      'Singles & Dating',
      'LGBTQ+ Events',
      "Women's Networking",
      'Young Professionals',
      'Alumni Gatherings',
      'Community Service',
      'Cultural Exchange',
      'Social Clubs',
    ],
  },
  {
    id: 'health',
    label: 'Health & Wellness',
    tags: [
      'Mental Health & Therapy',
      'Nutrition & Diet',
      'Wellness Retreats',
      'Spa & Relaxation',
      'Alternative Medicine',
      'Mindfulness & Meditation',
      'Fitness Challenges',
      'Weight Loss Support',
      'Holistic Health',
      'Sleep & Recovery',
    ],
  },
  {
    id: 'shopping',
    label: 'Shopping & Fashion',
    tags: [
      'Fashion Shows',
      'Vintage & Thrift',
      'Luxury & Designer',
      'Streetwear',
      'Sustainable Fashion',
      'Jewelry & Accessories',
      'Pop-Up Shops',
      'Sample Sales',
      'Beauty & Makeup',
      'Fashion Markets',
    ],
  },
  {
    id: 'business',
    label: 'Business & Professional',
    tags: [
      'Career Fairs',
      'Case Competitions',
      'Conferences & Summits',
      'Trade Shows',
      'Leadership Development',
      'Sales & Marketing',
      'Finance & Investing',
      'Real Estate',
      'Legal & Compliance',
      'Human Resources',
      'Project Management',
      'B2B Networking',
    ],
  },
  {
    id: 'performing',
    label: 'Performing Arts',
    tags: [
      'Stand-Up Comedy',
      'Improv & Sketch',
      'Musical Theater',
      'Opera & Classical Performance',
      'Magic Shows',
      'Circus & Acrobatics',
      'Live Performance Art',
    ],
  },
  {
    id: 'travel',
    label: 'Travel & Adventure',
    tags: [
      'Travel Meetups',
      'Adventure Travel',
      'Backpacking',
      'Road Trips',
      'Cultural Tours',
      'Luxury Travel',
      'Solo Travel',
      'Budget Travel',
      'Travel Photography',
      'Study Abroad',
    ],
  },
  {
    id: 'pets',
    label: 'Pets & Animals',
    tags: [
      'Dog Meetups & Walks',
      'Cat Cafes & Events',
      'Pet Adoption Events',
      'Exotic Pets',
      'Pet Training',
      'Animal Rescue & Advocacy',
      'Wildlife Conservation',
      'Aquarium & Fish Keeping',
      'Pet-Friendly Activities',
    ],
  },
  {
    id: 'home',
    label: 'Home & Lifestyle',
    tags: [
      'Interior Design',
      'DIY & Home Improvement',
      'Real Estate & Housing',
      'Sustainable Living',
      'Minimalism',
      'Organization & Decluttering',
      'Home Decor',
      'Smart Home Technology',
    ],
  },
  {
    id: 'nightlife',
    label: 'Nightlife & Parties',
    tags: [
      'Clubs & Dancing',
      'Bar Hopping',
      'Live DJ Sets',
      'Karaoke',
      'Themed Parties',
      'Raves & Electronic Music',
      'Pub Quizzes',
      'Rooftop Bars',
      'Happy Hour Events',
      'Silent Discos',
    ],
  },
  {
    id: 'science',
    label: 'Science & Academia',
    tags: [
      'Physics & Astronomy',
      'Biology & Life Sciences',
      'Chemistry',
      'Mathematics',
      'Psychology',
      'Social Sciences',
      'Philosophy',
      'Research Symposiums',
      'Science Cafes',
      'Lab Tours & Demos',
    ],
  },
  {
    id: 'spirituality',
    label: 'Spirituality & Religion',
    tags: [
      'Meditation & Mindfulness',
      'Yoga & Spiritual Practice',
      'Religious Services',
      'Interfaith Dialogue',
      'Buddhist Teachings',
      'Christian Fellowship',
      'Jewish Community Events',
      'Islamic Gatherings',
      'New Age & Metaphysical',
      'Prayer Groups',
    ],
  },
];

/** Flat list of every tag in taxonomy order. Handy for classifier keyword lookups. */
export const ALL_TAXONOMY_TAGS: string[] = TAXONOMY_BUCKETS.flatMap((b) => b.tags);

/** Set of all valid bucket IDs — useful for fast membership checks. */
export const BUCKET_ID_SET: ReadonlySet<string> = new Set(TAXONOMY_BUCKETS.map((b) => b.id));
