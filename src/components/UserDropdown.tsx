"use client";

import Image from "next/image";
import type { User } from "@/types/user";

interface UserDropdownProps {
  /** Array of users to display */
  users: User[];
  /** Currently selected user index */
  selectedIndex: number;
  /** Whether dropdown is visible */
  isVisible: boolean;
  /** Callback when user is selected */
  onSelectUser: (user: User) => void;
  /** Search query for highlighting */
  searchQuery?: string;
}

export function UserDropdown({
  users,
  selectedIndex,
  isVisible,
  onSelectUser,
  searchQuery = "",
}: UserDropdownProps) {
  if (!isVisible) {
    return (
      <div className="w-full h-48 sm:h-56 lg:h-64 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 text-sm p-4">
        <span className="text-center">
          {users.length === 0
            ? "No users found"
            : "Start typing @ to search users..."}
        </span>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="w-full h-48 sm:h-56 lg:h-64 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 text-sm p-4">
        <span className="text-center">No users found</span>
      </div>
    );
  }

  const highlightText = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, partIndex) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={`${text}-${partIndex}-${part}`}
          className="bg-yellow-200 text-gray-900"
        >
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="w-full h-48 sm:h-56 lg:h-64 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
        <h3 className="text-sm font-medium text-gray-900">
          Select User ({users.length} found)
        </h3>
      </div>

      {/* User list - scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-1">
          {users.map((user, index) => (
            <button
              key={user.id}
              type="button"
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 cursor-pointer transition-colors text-left ${
                index === selectedIndex
                  ? "bg-blue-50 border-r-4 border-blue-500"
                  : "hover:bg-gray-50 active:bg-gray-100"
              }`}
              onClick={() => onSelectUser(user)}
            >
              <Image
                src={user.pfp}
                alt={user.displayName}
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate text-sm">
                  {highlightText(user.displayName, searchQuery)}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 truncate">
                  @{highlightText(user.name, searchQuery)}
                </div>
              </div>
              {index === selectedIndex && (
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer with controls - responsive */}
      <div className="px-3 sm:px-4 py-2 border-t border-gray-100 bg-gray-50 rounded-b-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs text-gray-500">
          <span className="truncate">
            {searchQuery ? `Search: "${searchQuery}"` : "Type @ to search"}
          </span>
          <div className="flex items-center gap-2 text-xs">
            <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded text-xs">
              ↑↓
            </kbd>
            <span className="hidden sm:inline">navigate</span>
            <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded text-xs">
              Enter
            </kbd>
            <span className="hidden sm:inline">select</span>
          </div>
        </div>
      </div>
    </div>
  );
}
