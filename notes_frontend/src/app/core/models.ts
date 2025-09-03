/** Domain models used across the app. */

export type ID = string;

/** Category/tag for notes. */
export interface Category {
  id: ID;
  name: string;
  color?: string;
}

/** The Note entity. */
export interface Note {
  id: ID;
  title: string;
  content: string;
  categoryId?: ID | null;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  archived?: boolean;
}

/** Auth user profile minimal shape. */
export interface UserProfile {
  id: ID;
  email: string;
  name?: string;
}

/** Filters for searching notes. */
export interface NoteQuery {
  q?: string;
  categoryId?: ID | null;
  archived?: boolean;
  page?: number;
  pageSize?: number;
}
