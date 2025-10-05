"use client";

import { useMentionTextarea } from "@/hooks/useMentionTextarea";
import { UserDropdown } from "./UserDropdown";

interface MentionTextareaProps {
  /** Callback when text changes */
  onChange?: (displayText: string, dataText: string) => void;
  /** Callback when user submits (e.g., form submission) */
  onSubmit?: (dataText: string) => void;
}

export function MentionTextarea({ onChange, onSubmit }: MentionTextareaProps) {
  const {
    textState,
    searchState,
    textareaRef,
    handleInputChange,
    handleKeyDown,
    handleBlur,
    selectUser,
    getDataText,
  } = useMentionTextarea();

  // Handle text changes and notify parent
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);

    if (onChange) {
      // Use timeout to get updated state after handleInputChange
      setTimeout(() => {
        onChange(textState.displayText, getDataText());
      }, 0);
    }
  };

  // Handle form submission
  const handleSubmitInternal = () => {
    if (onSubmit) {
      onSubmit(getDataText());
    }
  };

  // Enhanced key down handler
  const handleKeyDownInternal = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    // Handle form submission with Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmitInternal();
      return;
    }

    // Pass to mention handler
    handleKeyDown(e);
  };

  // Calculate mention styles for visual feedback
  const getMentionStyle = (text: string): React.CSSProperties => {
    // This is a simplified approach - for a full implementation,
    // you'd want to use a rich text editor or overlay approach
    return {};
  };

  return (
    <div className="w-full">
      {/* Main layout: textarea on left, dropdown area on right */}
      <div className="flex gap-4">
        {/* Textarea container */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={textState.displayText}
            onChange={handleChange}
            onKeyDown={handleKeyDownInternal}
            onBlur={handleBlur}
            placeholder={"Type @ to mention someone..."}
            className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm leading-relaxed"
            style={getMentionStyle(textState.displayText)}
          />

          {/* Status indicators */}
          {searchState.isSearching && (
            <div className="absolute top-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
              Searching...
            </div>
          )}
        </div>

        {/* Dropdown area - always reserve space */}
        <div className="w-80 flex-shrink-0">
          <UserDropdown
            users={searchState.filteredUsers}
            selectedIndex={searchState.selectedIndex}
            isVisible={searchState.showDropdown}
            onSelectUser={selectUser}
            searchQuery={searchState.searchQuery}
          />
        </div>
      </div>

      {/* Helper text */}
      <div className="mt-2 text-xs text-gray-500 space-y-1">
        <div className="flex items-center justify-between">
          <span>
            Type{" "}
            <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">
              @
            </kbd>{" "}
            to mention users
          </span>
          <span className="flex items-center gap-2">
            <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">
              Ctrl+Enter
            </kbd>
            <span>to submit</span>
          </span>
        </div>
        {textState.mentions.length > 0 && (
          <div>
            Mentions:{" "}
            {textState.mentions.map((m) => `@${m.displayName}`).join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}
