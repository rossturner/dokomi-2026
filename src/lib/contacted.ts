import type { ContactedMap } from './types';

export const STORAGE_KEY = 'dokomi-convention-contacted-v1';

export function toggleContacted(state: ContactedMap, slug: string): ContactedMap {
  const next = { ...state };
  if (next[slug]) {
    delete next[slug];
  } else {
    next[slug] = true;
  }
  return next;
}

export function loadContacted(): ContactedMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as ContactedMap;
    }
    return {};
  } catch {
    return {};
  }
}

export function saveContacted(state: ContactedMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
