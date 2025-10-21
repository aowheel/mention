import type { User } from "./user";

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
  /** Internal data text */
  dataTextState: string;
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
  handleSelectUser: (user: User) => void;
}
