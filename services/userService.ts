import type { UserProfile } from '../types';
import { newUserTemplate } from '../data/mockData';

const DB_KEY = 'pinenagland_users';
const SESSION_KEY = 'pinenagland_session';

/**
 * Retrieves the entire user database from localStorage.
 * @returns An object where keys are user emails and values are UserProfile objects.
 */
function getDb(): { [email: string]: UserProfile } {
  try {
    const db = window.localStorage.getItem(DB_KEY);
    return db ? JSON.parse(db) : {};
  } catch (error) {
    console.error("Failed to read user database from localStorage", error);
    return {};
  }
}

/**
 * Saves the entire user database to localStorage.
 * @param db - The user database object to save.
 */
function saveDb(db: { [email: string]: UserProfile }) {
  try {
    window.localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (error) {
    console.error("Failed to write user database to localStorage", error);
  }
}

/**
 * Creates a new user account with a fresh profile.
 * @param email - The email for the new user.
 * @returns The new UserProfile object, or null if the user already exists.
 */
export function signup(email: string): UserProfile | null {
  const db = getDb();
  if (db[email]) {
    return null; // User already exists
  }
  const newUser: UserProfile = {
    ...newUserTemplate,
    email: email,
    name: 'New Seeker',
    picture: `https://i.pravatar.cc/300?u=${email}`, // Unique placeholder avatar
  };
  db[email] = newUser;
  saveDb(db);
  return newUser;
}

/**
 * Retrieves a user profile by email.
 * @param email - The email of the user to log in.
 * @returns The UserProfile object, or null if not found.
 */
export function login(email: string): UserProfile | null {
  const db = getDb();
  return db[email] || null;
}

/**
 * Updates a user's profile data in the database.
 * @param email - The email of the user to update.
 * @param profile - The complete, updated UserProfile object.
 */
export function updateUserProfile(email: string, profile: UserProfile): void {
  const db = getDb();
  if (db[email]) {
    db[email] = profile;
    saveDb(db);
  }
}

/**
 * Stores the current user's email in sessionStorage to maintain a session.
 * @param email - The email of the logged-in user.
 */
export function createSession(email: string): void {
  try {
    window.sessionStorage.setItem(SESSION_KEY, email);
  } catch (error)
    {
    console.error("Failed to write to sessionStorage", error);
  }
}

/**
 * Retrieves the current user's email from sessionStorage.
 * @returns The logged-in user's email, or null if no session exists.
 */
export function getCurrentUserEmail(): string | null {
  try {
    return window.sessionStorage.getItem(SESSION_KEY);
  } catch (error) {
    console.error("Failed to read from sessionStorage", error);
    return null;
  }
}

/**
 * Clears the current user session from sessionStorage.
 */
export function logout(): void {
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error("Failed to clear sessionStorage", error);
  }
}