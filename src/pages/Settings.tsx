import React from 'react';
import { useForm } from 'react-hook-form';

type SettingsForm = {
  fetchInterval: number;
  maxPosts: number;
  autoPublish: boolean;
};

export default function Settings() {
  const { register, handleSubmit } = useForm<SettingsForm>({
    defaultValues: {
      fetchInterval: 60,
      maxPosts: 50,
      autoPublish: false
    }
  });

  const onSubmit = (data: SettingsForm) => {
    localStorage.setItem('settings', JSON.stringify(data));
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Feed Fetch Interval (minutes)
          </label>
          <input
            type="number"
            {...register('fetchInterval', { min: 5 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Maximum Posts to Keep
          </label>
          <input
            type="number"
            {...register('maxPosts', { min: 10 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('autoPublish')}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Auto-publish new posts
          </label>
        </div>

        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}