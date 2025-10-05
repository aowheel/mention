# Interactive Mention System Demo

A Next.js application demonstrating an advanced mention system with real-time user search and intelligent text formatting. This interactive demo showcases modern React patterns, TypeScript implementation, and sophisticated text manipulation for @mention functionality with live preview of display and data formats.

## Features

- **Advanced Mention System**: Type `@` to trigger user search and selection
- **Dual Text Format**: Seamless conversion between display text (`@Alice`) and data text (`<@user_001>`)
- **Real-time Search**: 300ms debounced search with fuzzy matching on both name and display name
- **Smart Text Processing**: Maintains mention positions during text editing and conversion
- **Keyboard Navigation**: Arrow keys and Enter for dropdown selection
- **Live Preview**: Real-time display of both user interface and backend data formats
- **Interactive Demo**: Complete testing environment with submission and clear functionality
- **Modern UI**: Clean interface with Tailwind CSS styling
- **TypeScript**: Fully typed implementation with strict type safety

## Getting Started

First, install dependencies:

```bash
pnpm install
# or
npm install
# or
yarn install
```

Then, run the development server:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the interactive mention system demo in action.

## How It Works

### Mention System Architecture

The application uses a sophisticated dual-text system:

- **Display Text**: What users see in the textarea (`@Alice`, `@Bob`)
- **Data Text**: Backend-compatible format (`<@user_001>`, `<@user_002>`)

### Key Components

- **MentionTextarea**: Main input component with mention detection and insertion
- **UserDropdown**: Search results dropdown with keyboard navigation
- **useMentionTextarea**: Custom hook managing mention state and search logic

### Usage

1. Type `@` in the textarea to trigger user search
2. Continue typing to filter users by name or display name
3. Use arrow keys to navigate search results
4. Press Enter or click to select a user
5. The mention is inserted and highlighted in the text
6. Watch the real-time preview showing both display and data formats
7. Submit your message to see the final structured data output

## Technical Details

### State Management
- Mentions processed in reverse order to maintain position integrity
- Asynchronous state synchronization with `setTimeout(0)` pattern
- 150ms blur delay to allow dropdown interactions

### Search Behavior
- Matches both `user.name` AND `user.displayName` fields
- 300ms debounced search for optimal performance
- Search stops on whitespace or newlines

### Text Conversion
- `convertDisplayToDataText()` converts `@Alice` to `<@user_001>`
- Position tracking maintains cursor and mention locations
- `findMentionAtCursor()` detects @ symbol for search activation

## Tech Stack

- **Next.js 15.5.4** with App Router and Turbopack
- **React 19.1.0** with modern hooks
- **TypeScript 5** with strict type checking
- **Tailwind CSS 4** for styling
- **Biome** for linting and formatting

## Development Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Check code quality
pnpm format           # Format code
biome check --apply   # Fix linting and formatting issues
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/             # Reusable UI components
│   ├── MentionTextarea.tsx # Main mention input
│   └── UserDropdown.tsx    # User selection dropdown
├── hooks/                  # Custom React hooks
│   └── useMentionTextarea.ts # Mention logic
├── lib/                    # Static data
├── types/                  # TypeScript definitions
└── utils/                  # Text manipulation utilities
```

## Contributing

This project uses Biome for code formatting and linting. Before submitting changes:

1. Run `pnpm lint` to check code quality
2. Run `pnpm format` to format code
3. Test the mention functionality in the browser
4. Ensure the production build succeeds with `pnpm build`

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [React Documentation](https://react.dev) - React concepts and patterns
- [TypeScript Documentation](https://www.typescriptlang.org/docs) - TypeScript usage
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [Biome](https://biomejs.dev) - Fast formatter and linter
