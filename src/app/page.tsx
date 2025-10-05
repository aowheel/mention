"use client";

import Image from "next/image";
import { useUserSearch } from "@/hooks/useUserSearch";

export default function Home() {
  const { users, isSearching, searchQuery, setSearchQuery, clearSearch } =
    useUserSearch("", {
      debounceMs: 300,
      caseSensitive: false,
    });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">User Search</h1>

      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users (name or displayName)..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Clear Search
          </button>
        )}
      </div>

      {isSearching && (
        <div className="text-gray-500 mb-4 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          Searching...
        </div>
      )}

      <div className="grid gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <Image
              src={user.pfp}
              alt={user.displayName}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold text-lg">{user.displayName}</div>
              <div className="text-sm text-gray-500">@{user.name}</div>
              <div className="text-xs text-gray-400">{user.id}</div>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && searchQuery && !isSearching && (
        <div className="text-gray-500 text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-lg mb-2">😔</div>
          <div>No users found matching "{searchQuery}"</div>
        </div>
      )}

      {!searchQuery && (
        <div className="text-sm text-gray-600 mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Search Tips:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Partial matching search for name and displayName</li>
            <li>Try searching: "alice", "bob", "charlie", etc.</li>
            <li>Case insensitive search</li>
            <li>Search executes automatically 300ms after input</li>
          </ul>
        </div>
      )}
    </div>
  );
}
