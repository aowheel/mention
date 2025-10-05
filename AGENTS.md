# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Non-Obvious Patterns

### Dual Text Format System
- **displayText**: What users see (`@Alice`) - stored in `TextState.displayText`
- **dataText**: Backend format (`<@user_001>`) - generated via `getDataText()`
- Always convert using [`convertDisplayToDataText()`](src/utils/mentionUtils.ts:125) before API calls

### Mention Position Tracking
- Mentions stored with `startPosition`/`endPosition` in display text coordinates
- Process mentions in **reverse order** when converting to maintain positions
- Use [`findMentionAtCursor()`](src/utils/mentionUtils.ts:24) to detect @ searches

### State Synchronization
- Use `setTimeout(0)` pattern in [`MentionTextarea.tsx:31`](src/components/MentionTextarea.tsx:31) for state sync
- Search debounced at 300ms in [`useMentionTextarea.ts:45`](src/hooks/useMentionTextarea.ts:45)
- Blur delay of 150ms in [`useMentionTextarea.ts:231`](src/hooks/useMentionTextarea.ts:231) to allow clicks

### Search Behavior
- Matches both `user.name` AND `user.displayName` fields
- Test data intentionally has duplicate displayNames (user_005="Alice", user_008="Bob")
- Search stops on whitespace or newlines in query

### UI Layout
- Dropdown always reserves 320px width (`w-80`) even when hidden
- Fixed textarea height of 256px (`h-64`)

### Technical Details
- User IDs follow template: `user_${string}`
- Mention IDs use `crypto.randomUUID()` with "mention_" prefix
- Profile images from Unsplash require [`next.config.ts`](next.config.ts:4) remotePatterns
- Build/dev commands use `--turbopack` flag
- **No testing framework configured** - add tests manually if needed