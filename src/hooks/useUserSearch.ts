"use client";

import { useEffect, useMemo, useState } from "react";
import { type User, users } from "@/lib/data";

export interface UseUserSearchOptions {
  debounceMs?: number;
  caseSensitive?: boolean;
}

export interface UseUserSearchReturn {
  users: User[];
  isSearching: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

/**
 * Custom hook for searching users with partial matching
 * @param initialQuery Initial search query
 * @param options Search options
 * @returns Search results and utility functions
 */
export function useUserSearch(
  initialQuery = "",
  options: UseUserSearchOptions = {},
): UseUserSearchReturn {
  const { debounceMs = 300, caseSensitive = false } = options;
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce processing
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsSearching(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  // Memoized user search
  const filteredUsers = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return users;
    }

    const query = caseSensitive ? debouncedQuery : debouncedQuery.toLowerCase();

    return users.filter((user: User) => {
      const name = caseSensitive ? user.name : user.name.toLowerCase();
      const displayName = caseSensitive
        ? user.displayName
        : user.displayName.toLowerCase();

      return name.includes(query) || displayName.includes(query);
    });
  }, [debouncedQuery, caseSensitive]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  return {
    users: filteredUsers,
    isSearching,
    searchQuery,
    setSearchQuery,
    clearSearch,
  };
}
