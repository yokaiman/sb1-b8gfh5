import Parser from 'rss-parser';
import { db, type Feed, type Post } from './db';

const parser = new Parser();

export async function fetchFeed(url: string): Promise<Parser.Output<any>> {
  try {
    return await parser.parseURL(url);
  } catch (error) {
    throw new Error(`Failed to fetch feed: ${error.message}`);
  }
}

export async function processFeedItems(feed: Feed, items: Parser.Item[]): Promise<void> {
  const posts = items.map(item => ({
    title: item.title || 'Untitled',
    content: item.content || item.contentSnippet || '',
    sourceUrl: item.link || '',
    publishDate: item.pubDate ? new Date(item.pubDate) : new Date(),
    status: 'draft' as const,
    feedId: feed.id
  }));

  await db.posts.bulkAdd(posts);
  await db.feeds.update(feed.id!, {
    lastFetched: new Date()
  });
}