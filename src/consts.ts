export const SITE = {
  name: 'Robywire',
  tagline: 'Robotics, as it ships',
  description:
    'Robotics news, launches and events — written for people who read the spec sheet, ' +
    'not just the demo video.',
  url: 'https://robywire.com',
  domain: 'robywire.com',
} as const;

/** Closed vocabulary. A slug outside this list is a build error, not a new beat. */
export const BEATS = [
  {
    slug: 'humanoids',
    name: 'Humanoids',
    description:
      'General-purpose bipeds and androids, commercial and research. Home-specific ' +
      'humanoids file under Home & consumer.',
  },
  {
    slug: 'home-consumer',
    name: 'Home & consumer',
    description:
      'Robots for domestic and personal use, including home humanoids. Announcements, ' +
      'teardowns and claim-checking — not buy-advice reviews.',
  },
  {
    slug: 'industrial-warehouse',
    name: 'Industrial & warehouse',
    description: 'Arms, cobots, AMRs, fulfilment and manufacturing cells.',
  },
  {
    slug: 'field-mobility',
    name: 'Field & mobility',
    description:
      'Agriculture, construction, inspection, drones and outdoor autonomy. Not passenger ' +
      'self-driving cars.',
  },
  {
    slug: 'software-autonomy',
    name: 'Software & autonomy',
    description:
      'Vision-language-action models, sim-to-real, control stacks, teleoperation and perception.',
  },
  {
    slug: 'components-supply-chain',
    name: 'Components & supply chain',
    description: 'Actuators, harmonic drives, sensors, batteries, chips and supply.',
  },
  {
    slug: 'policy-standards',
    name: 'Policy & standards',
    description:
      'Regulation, safety standards (ISO, CE, OSHA), certification and labour.',
  },
] as const;

/** Cross-cutting tags. Ride alongside a beat, never on their own. */
export const TAGS = [
  {
    slug: 'funding',
    name: 'Funding',
    description: 'Rounds, M&A, IPOs and shutdowns, filed under the subject beat.',
  },
] as const;

export const BEAT_SLUGS = BEATS.map((b) => b.slug);
export const TAG_SLUGS = TAGS.map((t) => t.slug);
export const CATEGORY_SLUGS = [...BEAT_SLUGS, ...TAG_SLUGS];

export const FORMATS = ['news', 'explainer', 'launch', 'field-notes'] as const;

/** Slugs a post may not use, because the router needs them. */
export const RESERVED_SLUGS = ['page', 'index', 'rss.xml'];

export const NAV = [
  { href: '/', label: 'Latest' },
  { href: '/news', label: 'Archive' },
  { href: '/topics', label: 'Topics' },
  { href: '/about', label: 'About' },
];

export const POSTS_PER_PAGE = 12;

export function beatName(slug: string): string {
  return (
    BEATS.find((b) => b.slug === slug)?.name ??
    TAGS.find((t) => t.slug === slug)?.name ??
    slug
  );
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** ~200 wpm, rounded up. */
export function readingTime(body: string | undefined): string {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min`;
}
