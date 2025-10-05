import type { User } from "./user";

/**
 * Represents a mention within text
 */
export interface MentionData {
  /** Unique identifier for this mention instance */
  id: string;
  /** User ID being mentioned */
  userId: string;
  /** Display name shown to the user */
  displayName: string;
  /** Start position in the display text */
  startPosition: number;
  /** End position in the display text */
  endPosition: number;
}

/**
 * Current state of the text with mentions
 */
export interface TextState {
  /** Text as displayed to the user (@DisplayName format) */
  displayText: string;
  /** Text in data format (<@user_id> format) */
  dataText: string;
  /** Array of active mentions with their positions */
  mentions: MentionData[];
  /** Current cursor position in the display text */
  cursorPosition: number;
}

/**
 * State for mention search and dropdown
 */
export interface SearchState {
  /** Whether we're currently searching for users */
  isSearching: boolean;
  /** Current search query after @ symbol */
  searchQuery: string;
  /** Position where the @ symbol starts */
  searchStartPosition: number;
  /** Filtered users based on search query */
  filteredUsers: User[];
  /** Currently selected user index in dropdown */
  selectedIndex: number;
  /** Whether dropdown is visible */
  showDropdown: boolean;
}

/**
 * Return type for useMentionTextarea hook
 */
export interface UseMentionTextareaReturn {
  /** Current text state */
  textState: TextState;
  /** Current search state */
  searchState: SearchState;
  /** Reference to attach to textarea element */
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  /** Handle text input changes */
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** Handle key down events */
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  /** Handle blur events */
  handleBlur: () => void;
  /** Select a user from dropdown */
  selectUser: (user: User) => void;
  /** Get final data text with <@user_id> format */
  getDataText: () => string;
}
