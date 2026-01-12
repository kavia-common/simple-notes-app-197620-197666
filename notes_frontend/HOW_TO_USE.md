# Ocean Notes (Qwik) — How to Use

This is a local-first notes app built with **Qwik + QwikCity**. It does not require any backend services.

## Features

- Create, view, edit, delete notes
- Notes persist in `localStorage` (device/browser storage)
- Seed/demo notes are created on first load if storage is empty
- Notes list:
  - Search title/content
  - Sort by updated time or title
- Note editor:
  - Autosaves after you pause typing
  - Manual save button
  - Keyboard shortcut: **Ctrl/⌘ + S**
  - Optional minimal markdown preview (no external markdown library)

## Routes

- `/` — Notes list + create note
- `/note/:id` — Note detail / editor

## Where the code lives

- `src/lib/notes.ts` — Types + localStorage CRUD + seeding
- `src/lib/markdown.ts` — Minimal markdown preview renderer
- `src/routes/layout.tsx` — App shell (sidebar + main)
- `src/routes/index.tsx` — Notes list page
- `src/routes/note/[id]/index.tsx` — Note detail/editor page
- `src/components/ui/*` — Shared UI components (Button, Input, Card, Confirm modal, Badge)
- `src/global.css` + `src/styles/app.css` — Ocean Professional theme + component styles

## Run locally

From `notes_frontend/`:

```bash
npm install
npm run dev
```

Preview production build:

```bash
npm run build
npm run preview
```
