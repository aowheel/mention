"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { users } from "@/lib/data";
import type {
  MentionData,
  SearchState,
  TextState,
  UseMentionTextareaReturn,
} from "@/types/mention";
import type { User } from "@/types/user";
import {
  convertDisplayToDataText,
  findMentionAtCursor,
  generateMentionId,
  insertMentionIntoText,
} from "@/utils/mentionUtils";

export function useMentionTextarea(): UseMentionTextareaReturn {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Text state management
  const [textState, setTextState] = useState<TextState>({
    displayText: "",
    dataText: "",
    mentions: [],
    cursorPosition: 0,
  });

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

    return users.filter((user: User) => {
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
  const selectUser = useCallback(
    (user: User) => {
      if (!searchState.isSearching) return;

      // Create new mention
      const newMention: MentionData = {
        id: generateMentionId(),
        userId: user.id,
        displayName: user.displayName,
        startPosition: searchState.searchStartPosition,
        endPosition:
          searchState.searchStartPosition + `@${user.displayName}`.length,
      };

      // Insert mention into text
      const { displayText, dataText } = insertMentionIntoText(
        textState.displayText,
        newMention,
        searchState.searchStartPosition,
        textState.cursorPosition,
      );

      // Update mentions array
      const updatedMentions = [...textState.mentions, newMention];

      // Update text state
      setTextState((prev) => ({
        ...prev,
        displayText,
        dataText,
        mentions: updatedMentions,
        cursorPosition: newMention.endPosition,
      }));

      // Clear search state
      setSearchState((prev) => ({
        ...prev,
        isSearching: false,
        showDropdown: false,
        searchQuery: "",
        searchStartPosition: -1,
        selectedIndex: 0,
      }));

      // Set cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(
            newMention.endPosition,
            newMention.endPosition,
          );
          textareaRef.current.focus();
        }
      }, 0);
    },
    [searchState, textState],
  );

  // Handle input changes
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      const cursorPosition = e.target.selectionStart;

      // Update text state
      setTextState((prev) => ({
        ...prev,
        displayText: newText,
        cursorPosition,
      }));

      // Check for mention at cursor
      const mentionInfo = findMentionAtCursor(newText, cursorPosition);

      if (mentionInfo.isSearching) {
        // Start or update search
        setSearchState((prev) => ({
          ...prev,
          isSearching: true,
          searchQuery: mentionInfo.searchQuery,
          searchStartPosition: mentionInfo.searchStartPosition,
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
    },
    [],
  );

  // Handle key down events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!searchState.showDropdown || searchState.filteredUsers.length === 0) {
        return;
      }

      switch (e.key) {
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
            selectUser(searchState.filteredUsers[searchState.selectedIndex]);
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
      searchState.showDropdown,
      searchState.filteredUsers,
      searchState.selectedIndex,
      selectUser,
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

  // Get final data text
  const getDataText = useCallback(() => {
    return convertDisplayToDataText(textState.displayText, textState.mentions);
  }, [textState.displayText, textState.mentions]);

  return {
    textState,
    searchState,
    textareaRef,
    handleInputChange,
    handleKeyDown,
    handleBlur,
    selectUser,
    getDataText,
  };
}
