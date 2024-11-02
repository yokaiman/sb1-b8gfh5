import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { RssIcon, DocumentTextIcon, PencilIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { db } from '../lib/db';

export default function Dashboard() {
  const stats = useLiveQuery(async () => {
    const feedCount = await db.feeds.count();
    const postCount = await db.posts.count();
    const draftCount = await db.posts.where('status').equals('draft').count();
    const publishedCount = await db.posts.where('status').equals('published').count();

    return { feedCount, postCount, draftCount, publishedCount };
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <RssIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Feeds</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats?.feedCount ?? 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Posts</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats?.postCount ?? 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PencilIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Draft Posts</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats?.draftCount ?? 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Published Posts</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats?.publishedCount ?? 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}