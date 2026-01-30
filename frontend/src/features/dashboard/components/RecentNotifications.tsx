'use client';

import { motion } from 'framer-motion';
import { Bell, Calendar, Info } from 'lucide-react';

export default function RecentNotifications() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl p-6 shadow-lg border-2 border-blue-200 dark:border-gray-700 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-gray-800 dark:to-gray-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">Recent Notifications</h2>
            <p className="text-sm text-gray-700 dark:text-gray-400 font-medium">University-wide announcements</p>
          </div>
        </div>
        <span className="text-xs px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white font-semibold shadow-md">
          Coming Soon
        </span>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-12">
        <div className="p-5 rounded-full bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 dark:bg-gray-800/50 mb-4 shadow-lg">
          <Info className="w-8 h-8 text-white dark:text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-300 mb-2">
          No Notifications Yet
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-400 text-center max-w-md font-medium">
          University-wide notifications and announcements will appear here once the notification system is implemented.
        </p>
      </div>
    </motion.div>
  );
}
