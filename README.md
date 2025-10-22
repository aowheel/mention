# Interactive Mention System Demo

This Next.js demo showcases a modern @mention experience with real-time search, dual-format text handling, and a live preview of the rendered and backend-safe values. It highlights how to keep display text and stored data in sync while preserving cursor position and mention ranges.

## Features

- **Dual Text Formats**: Keeps `@Alice` visible while storing `<@user_001>` data strings
- **Substring User Search**: 300 ms debounced filtering across both `user.name` and `user.displayName`
- **Position-Safe Editing**: Utilities update mentions without breaking offsets during typing or deletion
- **Keyboard-First UX**: Arrow keys, Enter, Tab, and Escape control the dropdown
- **Live Data Preview**: UI renders display and data text states side-by-side
- **Tailwind Styling**: Fixed textarea height with a reserved dropdown column for consistent layout

## Getting Started

Install dependencies:

```bash
pnpm install
# or
npm install
# or
yarn install
```

Run the development server:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the mention workflow.

## How It Works

- **MentionTextarea** (`src/components/MentionTextarea.tsx`): Renders the textarea, live preview, and wiring for keyboard events.
- **useMentionTextarea** (`src/hooks/useMentionTextarea.ts`): Manages debounced search state, dropdown selection, and cursor-safe updates.
- **mentionUtils** (`src/utils/mentionUtils.ts`): Converts between display/data text, tracks mention ranges, and guards against invalid edits.
- **Static Data** (`src/lib/data.ts`): Provides demo users with duplicate `displayName` values to exercise search behavior.

The hook stores data text internally, derives display text on the fly, and calls `convertDisplayToDataText()` before submission to ensure backend compatibility. Search resets when whitespace or newlines interrupt the query, and up to ten matches are shown.

## Implementation Notes

- Mentions are processed from the end of the string to preserve index integrity.
- Cursor synchronization uses a `setTimeout(0)` pattern so the textarea reflects updates after React state commits.
- Dropdown visibility is delayed by 150 ms on blur to allow click selection.
- Textarea height is fixed (`h-64`), and the dropdown reserves 320 px width (`w-80`) even when hidden.
- No automated test runner is bundled; interact with the demo manually or add tests as needed.

## Tech Stack

- **Next.js 15.5.4** with the App Router and Turbopack dev server
- **React 19.1.0** with modern hooks and concurrent-ready patterns
- **TypeScript 5** with strict configuration
- **Tailwind CSS 4** for utility-first styling
- **Biome 2.2.0** for linting and formatting (`next.config.ts` enables Unsplash avatars)

## Project Structure

```
src/
├── app/                    # App Router entry, layout, and global styles
├── components/             # UI components (MentionTextarea, UserDropdown)
├── hooks/                  # useMentionTextarea hook
├── lib/                    # Static datasets
├── types/                  # Shared TypeScript types
└── utils/                  # Mention parsing and formatting helpers
```

## Development Commands

```bash
# Development
pnpm dev              # Start the dev server with Turbopack
pnpm build            # Create a production build
pnpm start            # Serve the production build

# Code Quality
pnpm lint             # Run Biome checks
pnpm format           # Apply Biome formatting
```
