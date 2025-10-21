"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { users } from "@/lib/data";
import type { SearchState, UseMentionTextareaReturn } from "@/types/mention";
import type { User } from "@/types/user";
import {
  checkMentionSearch,
  convertDataToDisplayText,
  deleteTextWithMentions,
  insertCharIntoText,
  insertMentionIntoText,
} from "@/utils/mentionUtils";

export function useMentionTextarea(): UseMentionTextareaReturn {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Internal data text state (using <@user_id> format)
  const [dataTextState, setDataTextState] = useState("");

  // Display text (computed from dataText)
  const displayText = useMemo(
    () => convertDataToDisplayText(dataTextState),
    [dataTextState],
  );

  // Search state management
  const [searchState, setSearchState] = useState<SearchState>({
    isSearching: false,
    searchQuery: "",
    searchStartPosition: -1,
    filteredUsers: [],
    selectedIndex: 0,
    showDropdown: false,
  });

  // Debounced search query state
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query processing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchState.searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchState.searchQuery]);

  // Memoized user search with filtering logic
  const filteredUsers = useMemo(() => {
    const query = debouncedSearchQuery.toLowerCase();

    return users.filter((user) => {
      const name = user.name.toLowerCase();
      const displayName = user.displayName.toLowerCase();

      return name.includes(query) || displayName.includes(query);
    });
  }, [debouncedSearchQuery]);

  // Update filtered users when search results change
  useEffect(() => {
    const limitedUsers = filteredUsers.slice(0, 10);
    setSearchState((prev) => ({
      ...prev,
      filteredUsers: limitedUsers,
      selectedIndex: 0, // Reset selection when users change
    }));
  }, [filteredUsers]);

  // Select a user from dropdown
  const handleSelectUser = useCallback(
    (user: User) => {
      if (!searchState.isSearching) return;

      // Get cursor position before @ symbol
      const searchStart = searchState.searchStartPosition;
      const cursorPos = textareaRef.current?.selectionStart ?? 0;

      // Insert mention into data text
      const result = insertMentionIntoText(
        dataTextState,
        user,
        searchStart,
        cursorPos,
      );

      setDataTextState(result.dataText);

      // Clear search state
      setSearchState((prev) => ({
        ...prev,
        isSearching: false,
        showDropdown: false,
        searchQuery: "",
        searchStartPosition: -1,
        selectedIndex: 0,
      }));

      // Set cursor position after mention
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(
            result.displayCursorPos,
            result.displayCursorPos,
          );
          textareaRef.current.focus();
        }
      }, 0);
    },
    [searchState, dataTextState],
  );

  // Handle input changes
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newDisplayText = e.target.value;
      const cursorPos = e.target.selectionStart;

      // Check for @ search at cursor position using utility function
      const mentionSearchInfo = checkMentionSearch(newDisplayText, cursorPos);

      if (mentionSearchInfo.isSearching) {
        // Start or update search
        setSearchState((prev) => ({
          ...prev,
          isSearching: true,
          searchQuery: mentionSearchInfo.searchQuery,
          searchStartPosition: mentionSearchInfo.searchStartPosition,
          showDropdown: true,
        }));
      } else {
        // Stop search
        setSearchState((prev) => ({
          ...prev,
          isSearching: false,
          searchQuery: "",
          searchStartPosition: -1,
          showDropdown: false,
          selectedIndex: 0,
        }));
      }

      // Update data text based on display text change
      if (newDisplayText.length === displayText.length + 1) {
        const newChar = newDisplayText.charAt(cursorPos - 1);
        const result = insertCharIntoText(
          dataTextState,
          newChar,
          cursorPos - 1,
        );
        setDataTextState(result.dataText);
      }
    },
    [displayText, dataTextState],
  );

  // Handle key down events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const selectionStart = e.currentTarget.selectionStart;
      const selectionEnd = e.currentTarget.selectionEnd;

      switch (e.key) {
        case "Backspace": {
          e.preventDefault();

          // Apply deletion to data text
          const result = deleteTextWithMentions(
            dataTextState,
            selectionStart,
            selectionEnd,
          );
          setDataTextState(result.dataText);

          // Update cursor position
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.setSelectionRange(
                result.displayCursorPos,
                result.displayCursorPos,
              );
            }
          }, 0);
          break;
        }

        case "ArrowDown":
          e.preventDefault();
          setSearchState((prev) => ({
            ...prev,
            selectedIndex: Math.min(
              prev.selectedIndex + 1,
              prev.filteredUsers.length - 1,
            ),
          }));
          break;

        case "ArrowUp":
          e.preventDefault();
          setSearchState((prev) => ({
            ...prev,
            selectedIndex: Math.max(prev.selectedIndex - 1, 0),
          }));
          break;

        case "Enter":
        case "Tab":
          e.preventDefault();
          if (searchState.filteredUsers[searchState.selectedIndex]) {
            handleSelectUser(
              searchState.filteredUsers[searchState.selectedIndex],
            );
          }
          break;

        case "Escape":
          e.preventDefault();
          setSearchState((prev) => ({
            ...prev,
            isSearching: false,
            showDropdown: false,
            searchQuery: "",
            searchStartPosition: -1,
          }));
          break;
      }
    },
    [
      dataTextState,
      searchState.filteredUsers,
      searchState.selectedIndex,
      handleSelectUser,
    ],
  );

  // Handle blur events
  const handleBlur = useCallback(() => {
    // Delay hiding dropdown to allow for click events
    setTimeout(() => {
      setSearchState((prev) => ({
        ...prev,
        showDropdown: false,
      }));
    }, 150);
  }, []);

  return {
    dataTextState,
    searchState,
    textareaRef,
    handleInputChange,
    handleKeyDown,
    handleBlur,
    handleSelectUser,
  };
}
