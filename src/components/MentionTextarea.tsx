"use client";

import { useMentionTextarea } from "@/hooks/useMentionTextarea";
import { convertDataToDisplayText } from "@/utils/mentionUtils";
import { UserDropdown } from "./UserDropdown";

export function MentionTextarea() {
  const {
    dataTextState,
    searchState,
    textareaRef,
    handleInputChange,
    handleKeyDown,
    handleBlur,
    handleSelectUser,
  } = useMentionTextarea();

  const displayText = convertDataToDisplayText(dataTextState);

  return (
    <div className="w-full space-y-4">
      {/* Debug Info */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-2 text-sm font-mono">
        <div>
          <span className="font-semibold">Display Text:</span>{" "}
          {displayText || "(empty)"}
        </div>
        <div>
          <span className="font-semibold">Data Text:</span>{" "}
          {dataTextState || "(empty)"}
        </div>
      </div>

      {/* Responsive layout: side-by-side on desktop, stacked on mobile */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Textarea container */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={displayText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={"Type @ to mention someone..."}
            className="w-full h-48 sm:h-56 lg:h-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm leading-relaxed"
          />

          {/* Status indicators */}
          {searchState.isSearching && (
            <div className="absolute top-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow z-10">
              Searching...
            </div>
          )}
        </div>

        {/* Dropdown area - responsive width */}
        <div className="w-full lg:w-80 lg:flex-shrink-0">
          <UserDropdown
            users={searchState.filteredUsers}
            selectedIndex={searchState.selectedIndex}
            isVisible={searchState.showDropdown}
            onSelectUser={handleSelectUser}
            searchQuery={searchState.searchQuery}
          />
        </div>
      </div>
    </div>
  );
}
