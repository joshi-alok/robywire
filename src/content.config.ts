import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_SLUGS, FORMATS } from './consts';

// Closed vocabulary. An unknown slug fails the build, listing the valid options.
// Adding a beat is an editorial decision: edit BEATS in src/consts.ts first.
const category = z.enum(CATEGORY_SLUGS as [string, ...string[]]);

const news = defineCollection({
  loader: glob({ base: './src/content/news', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(1),
    // Meta description and card blurb. Enforced so a long one fails the build
    // rather than being silently truncated by search engines.
    description: z.string().min(1).max(155),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    categories: z.array(category).min(1).max(3),
    format: z.enum(FORMATS).default('news'),
    featured: z.boolean().default(false),
    author: z.object({
      name: z.string().min(1),
      avatar: z.string().optional(),
    }),
    // Remote URLs only — never an image file in the repo.
    image: z
      .object({
        light: z.string().url(),
        dark: z.string().url().optional(),
        aspectRatio: z.string().default('16/9'),
        credit: z.string().optional(),
        creditUrl: z.string().url().optional(),
      })
      .optional(),
  }),
});

export const collections = { news };
