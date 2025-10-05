import type { MentionData } from "@/types/mention";
import type { User } from "@/types/user";

/**
 * Regular expression to match mention patterns in text
 */
const MENTION_PATTERN = /@(\w+)/g;

/**
 * Regular expression to match data format mentions
 */
const DATA_MENTION_PATTERN = /<@(user_\w+)>/g;

/**
 * Generate a unique ID for a mention
 */
export function generateMentionId(): string {
  return `mention_${crypto.randomUUID()}`;
}

/**
 * Find @ symbol position and extract search query at cursor position
 */
export function findMentionAtCursor(
  text: string,
  cursorPosition: number,
): {
  isSearching: boolean;
  searchQuery: string;
  searchStartPosition: number;
} {
  // Look backward from cursor position to find @ symbol
  let searchStartPosition = -1;
  let i = cursorPosition - 1;

  // Find the closest @ before cursor
  while (i >= 0) {
    if (text[i] === "@") {
      searchStartPosition = i;
      break;
    }
    // Stop if we hit whitespace or another mention
    if (text[i] === " " || text[i] === "\n") {
      break;
    }
    i--;
  }

  if (searchStartPosition === -1) {
    return {
      isSearching: false,
      searchQuery: "",
      searchStartPosition: -1,
    };
  }

  // Extract text from @ to cursor position
  const searchQuery = text.slice(searchStartPosition + 1, cursorPosition);

  // Check if there's whitespace in the query (invalid mention)
  if (searchQuery.includes(" ") || searchQuery.includes("\n")) {
    return {
      isSearching: false,
      searchQuery: "",
      searchStartPosition: -1,
    };
  }

  return {
    isSearching: true,
    searchQuery,
    searchStartPosition,
  };
}

/**
 * Parse text to extract existing mentions and their positions
 */
export function parseExistingMentions(
  displayText: string,
  dataText: string,
): MentionData[] {
  const mentions: MentionData[] = [];
  const displayMatches = Array.from(displayText.matchAll(MENTION_PATTERN));
  const dataMatches = Array.from(dataText.matchAll(DATA_MENTION_PATTERN));

  // Match display mentions with data mentions by position
  displayMatches.forEach((displayMatch, index) => {
    const dataMatch = dataMatches[index];
    if (dataMatch) {
      mentions.push({
        id: generateMentionId(),
        userId: dataMatch[1], // Extract user_id from <@user_id>
        displayName: displayMatch[1], // Extract displayName from @displayName
        startPosition: displayMatch.index,
        endPosition: displayMatch.index + displayMatch[0].length,
      });
    }
  });

  return mentions;
}

/**
 * Insert mention into text at specified position
 */
export function insertMentionIntoText(
  text: string,
  mention: MentionData,
  startPosition: number,
  endPosition: number,
): { displayText: string; dataText: string } {
  const beforeText = text.slice(0, startPosition);
  const afterText = text.slice(endPosition);

  const displayText = `${beforeText}@${mention.displayName}${afterText}`;
  const dataText = `${beforeText}<@${mention.userId}>${afterText}`;

  return { displayText, dataText };
}

/**
 * Convert display text with mentions to data format
 */
export function convertDisplayToDataText(
  displayText: string,
  mentions: MentionData[],
): string {
  let dataText = displayText;

  // Sort mentions by position (reverse order to maintain positions)
  const sortedMentions = [...mentions].sort(
    (a, b) => b.startPosition - a.startPosition,
  );

  sortedMentions.forEach((mention) => {
    const dataFormat = `<@${mention.userId}>`;

    dataText =
      dataText.slice(0, mention.startPosition) +
      dataFormat +
      dataText.slice(mention.endPosition);
  });

  return dataText;
}

/**
 * Convert data text to display format
 */
export function convertDataToDisplayText(
  dataText: string,
  userMap: Map<string, User>,
): {
  displayText: string;
  mentions: MentionData[];
} {
  let displayText = dataText;
  const mentions: MentionData[] = [];
  const matches = Array.from(dataText.matchAll(DATA_MENTION_PATTERN));

  // Process matches in reverse order to maintain positions
  matches.reverse().forEach((match) => {
    const userId = match[1];
    const user = userMap.get(userId);

    if (user) {
      const startIndex = match.index;
      const endIndex = startIndex + match[0].length;
      const displayName = user.displayName;

      // Replace data format with display format
      displayText =
        displayText.slice(0, startIndex) +
        `@${displayName}` +
        displayText.slice(endIndex);

      // Calculate new positions after replacement
      const newStartPosition = startIndex;
      const newEndPosition = startIndex + `@${displayName}`.length;

      mentions.unshift({
        id: generateMentionId(),
        userId,
        displayName,
        startPosition: newStartPosition,
        endPosition: newEndPosition,
      });
    }
  });

  return { displayText, mentions };
}
