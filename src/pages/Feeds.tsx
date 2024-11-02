import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useForm } from 'react-hook-form';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { db } from '../lib/db';
import { fetchFeed, processFeedItems } from '../lib/rss';

type FeedForm = {
  url: string;
  name: string;
};

export default function Feeds() {
  const feeds = useLiveQuery(() => db.feeds.toArray());
  const { register, handleSubmit, reset } = useForm<FeedForm>();

  const onSubmit = async (data: FeedForm) => {
    try {
      const feedData = await fetchFeed(data.url);
      const feed = await db.feeds.add({
        url: data.url,
        name: data.name || feedData.title || 'Unnamed Feed',
      });
      
      await processFeedItems({ ...data, id: feed }, feedData.items);
      reset();
    } catch (error) {
      console.error('Failed to add feed:', error);
    }
  };

  const deleteFeed = async (id: number) => {
    await db.feeds.delete(id);
    await db.posts.where('feedId').equals(id).delete();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">RSS Feeds</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            type="url"
            {...register('url', { required: true })}
            placeholder="Feed URL"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <input
            type="text"
            {...register('name')}
            placeholder="Feed Name (optional)"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Feed
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {feeds?.map(feed => (
          <div key={feed.id} className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">{feed.name}</h3>
                <p className="text-sm text-gray-500">{feed.url}</p>
                {feed.lastFetched && (
                  <p className="text-xs text-gray-400">
                    Last fetched: {new Date(feed.lastFetched).toLocaleString()}
                  </p>
                )}
              </div>
              <button
                onClick={() => feed.id && deleteFeed(feed.id)}
                className="text-red-600 hover:text-red-800"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}