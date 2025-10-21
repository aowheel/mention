import { users } from "@/lib/data";
import type { User } from "@/types/user";

const MENTION_PATTERN = /<@(user_\w+)>/g;

export function convertDataToDisplayText(dataText: string): string {
  return dataText.replaceAll(MENTION_PATTERN, (match, userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? `@${user.displayName}` : match;
  });
}

export function checkMentionSearch(
  displayText: string,
  cursorPos: number,
): {
  isSearching: boolean;
  searchQuery: string;
  searchStartPosition: number;
} {
  // Look backward from cursor position to find @ symbol
  let searchStartPosition = -1;
  let i = cursorPos - 1;

  // Find the closest @ before cursor
  while (i >= 0) {
    if (displayText[i] === "@" && (i === 0 || /\s/.test(displayText[i - 1]))) {
      searchStartPosition = i;
      break;
    }
    // Stop if we hit whitespace
    if (/\s/.test(displayText[i])) {
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
  const searchQuery = displayText.slice(searchStartPosition + 1, cursorPos);

  return {
    isSearching: true,
    searchQuery,
    searchStartPosition,
  };
}

function displayToDataCursorPos(
  dataText: string,
  displayCursorPos: number,
): {
  dataCursorPos: number;
  inMention: boolean;
  mentionStart?: number;
  mentionEnd?: number;
} {
  const matches = dataText.matchAll(MENTION_PATTERN);
  let displayCharCount = 0;
  let dataCharCount = 0;

  for (const match of matches) {
    // Length of text before this mention in data
    const textBeforeLength = match.index - dataCharCount;

    // Check if position is before this mention
    if (displayCursorPos < displayCharCount + textBeforeLength) {
      // Position is in the text before this mention
      return {
        dataCursorPos: dataCharCount + (displayCursorPos - displayCharCount),
        inMention: false,
      };
    }

    // Update counters for text before mention
    displayCharCount += textBeforeLength;
    dataCharCount += textBeforeLength;

    // Get mention lengths
    const user = users.find((u) => u.id === match[1]);
    const displayMention = user ? `@${user.displayName}` : match[0];
    const dataMention = match[0];

    // Check if position is within or at the end of this mention in display
    if (displayCursorPos <= displayCharCount + displayMention.length) {
      // Position is inside mention - calculate proportional position in data mention
      const offsetInDisplay = displayCursorPos - displayCharCount;
      const ratio = offsetInDisplay / displayMention.length;
      const offsetInData = Math.floor(ratio * dataMention.length);

      return {
        dataCursorPos: dataCharCount + offsetInData,
        inMention: true,
        mentionStart: match.index,
        mentionEnd: match.index + match[0].length,
      };
    }

    // Update counters for mention
    displayCharCount += displayMention.length;
    dataCharCount += dataMention.length;
  }

  // Position is after all mentions
  return {
    dataCursorPos: dataCharCount + (displayCursorPos - displayCharCount),
    inMention: false,
  };
}

export function insertCharIntoText(
  dataText: string,
  char: string,
  displayCursorPos: number,
): { dataText: string; displayCursorPos: number } {
  const info = displayToDataCursorPos(dataText, displayCursorPos);
  const beforeText = dataText.slice(0, info.dataCursorPos);
  const afterText = dataText.slice(info.dataCursorPos);

  const newDataText = beforeText + char + afterText;
  const newDisplayCursorPos = displayCursorPos + char.length;

  return {
    dataText: newDataText,
    displayCursorPos: newDisplayCursorPos,
  };
}

export function insertMentionIntoText(
  dataText: string,
  user: User,
  startDisplayCursorPos: number,
  endDisplayCursorPos: number,
): { dataText: string; displayCursorPos: number } {
  const startInfo = displayToDataCursorPos(dataText, startDisplayCursorPos);
  const endInfo = displayToDataCursorPos(dataText, endDisplayCursorPos);

  let beforeText = dataText.slice(0, startInfo.dataCursorPos);
  if (!beforeText.endsWith(" ")) {
    beforeText = `${beforeText} `;
  }

  let afterText = dataText.slice(endInfo.dataCursorPos);
  if (!afterText.startsWith(" ")) {
    afterText = ` ${afterText}`;
  }

  const displayCursorPos = convertDataToDisplayText(
    `${beforeText}<@${user.id}>$ `,
  ).length;

  return {
    dataText: `${beforeText}<@${user.id}>${afterText}`,
    displayCursorPos,
  };
}

export function deleteTextWithMentions(
  dataText: string,
  selectionStart: number,
  selectionEnd: number,
): { dataText: string; displayCursorPos: number } {
  // Convert display positions to data positions
  const startInfo = displayToDataCursorPos(dataText, selectionStart);
  const endInfo = displayToDataCursorPos(dataText, selectionEnd);

  let dataStart = startInfo.dataCursorPos;
  let dataEnd = endInfo.dataCursorPos;

  // If start is in a mention, expand to include entire mention
  if (startInfo.inMention && startInfo.mentionStart) {
    dataStart = startInfo.mentionStart;
  }

  // If end is in a mention, expand to include entire mention
  if (endInfo.inMention && endInfo.mentionEnd) {
    dataEnd = endInfo.mentionEnd;
  }

  // If no mention was deleted and positions are the same, delete one character in data
  if (dataStart === dataEnd) {
    // This means we're not deleting a mention, so delete one character in dataText
    dataStart -= 1;
  }

  const displayCursorPos = convertDataToDisplayText(
    dataText.slice(0, dataStart),
  ).length;

  // Delete the range and return new text
  return {
    dataText: dataText.slice(0, dataStart) + dataText.slice(dataEnd),
    displayCursorPos,
  };
}
