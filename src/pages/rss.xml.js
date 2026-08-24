import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../consts';

export async function GET(context) {
  const posts = (await getCollection('news')).sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
  );
  return rss({
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.publishedAt,
      link: `/news/${p.id}/`,
      categories: p.data.categories,
      author: p.data.author.name,
    })),
    customData: '<language>en-gb</language>',
  });
}
