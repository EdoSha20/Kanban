
# Kanban Board PWA

A simple Kanban Board built with SvelteKit and Tailwind CSS.

## Features

- Four lanes: Backlog, Start / Do, Doing / Progress, Done / Implement
- Create issues using an HTML dialog
- Drag and drop issues between lanes
- Save issues in localStorage
- Fibonacci story points and priority
- Due dates with overdue warnings
- Total story points per lane
- Export individual issues as ICS calendar files
- Share issues using the Web Share API
- Export all issues as CSV
- Notifications when an issue moves to Done
- Installable Progressive Web App (PWA)
- Offline support using a Service Worker

## Technologies

- SvelteKit
- Svelte 5
- Tailwind CSS
- JavaScript
- date-fns
- Service Worker

## Installation

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

## Usage

1. Click **+ New Issue** to create a task.
2. Drag tasks between the four lanes.
3. Move a task to **Done / Implement** to receive a notification.
4. Use **Export ICS**, **Share**, or **Export CSV**.
5. Install the app from a supported browser.

## Storage

Issues are stored locally in the browser using localStorage.
No account or database is required.

## Author

Edona Shabaj
