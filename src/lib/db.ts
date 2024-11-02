import Dexie, { type Table } from 'dexie';

export interface Feed {
  id?: number;
  url: string;
  name: string;
  lastFetched?: Date;
}

export interface Post {
  id?: number;
  title: string;
  content: string;
  sourceUrl?: string;
  publishDate: Date;
  status: 'draft' | 'published';
  feedId?: number;
}

export class AutoBlogDB extends Dexie {
  feeds!: Table<Feed>;
  posts!: Table<Post>;

  constructor() {
    super('AutoBlogDB');
    this.version(1).stores({
      feeds: '++id, url, name',
      posts: '++id, title, status, publishDate, feedId'
    });
  }
}

export const db = new AutoBlogDB();