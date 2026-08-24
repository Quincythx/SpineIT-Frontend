// Shelves are implemented on top of the existing ReadingList/ReadingListItem
// primitives (three well-known, auto-created lists per user) rather than a
// dedicated backend concept, since the backend contract doesn't have one yet.
// See memory: this is a frontend-only stand-in until the real backend defines
// proper reading-status support.
export const SHELVES = ['Want to Read', 'Currently Reading', 'Read'] as const;
export type ShelfName = (typeof SHELVES)[number];
