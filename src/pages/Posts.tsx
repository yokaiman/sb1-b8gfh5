import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { format } from 'date-fns';
import { PencilIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';
import { db } from '../lib/db';

export default function Posts() {
  const posts = useLiveQuery(() => 
    db.posts.orderBy('publishDate').reverse().toArray()
  );

  const updateStatus = async (id: number, status: 'draft' | 'published') => {
    await db.posts.update(id, { status });
  };

  const deletePost = async (id: number) => {
    await db.posts.delete(id);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Posts</h1>
      
      <div className="mt-6 space-y-4">
        {posts?.map(post => (
          <div key={post.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-xl font-medium">{post.title}</h2>
                <p className="mt-2 text-sm text-gray-500">
                  {format(post.publishDate, 'PPP')}
                </p>
                <div className="mt-4 prose max-w-none">
                  {post.content.substring(0, 200)}...
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => post.id && updateStatus(post.id, post.status === 'draft' ? 'published' : 'draft')}
                  className={`${
                    post.status === 'published' ? 'text-green-600' : 'text-gray-400'
                  } hover:text-green-800`}
                >
                  <CheckIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => post.id && deletePost(post.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}