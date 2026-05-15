import { describe, it, expect, beforeEach } from 'vitest';
import {
  toggleContacted,
  loadContacted,
  saveContacted,
  STORAGE_KEY,
} from '../src/lib/contacted';

describe('toggleContacted', () => {
  it('adds a slug as true when absent', () => {
    expect(toggleContacted({}, 'a')).toEqual({ a: true });
  });

  it('removes a slug when present', () => {
    expect(toggleContacted({ a: true }, 'a')).toEqual({});
  });

  it('leaves other slugs untouched', () => {
    expect(toggleContacted({ a: true, b: true }, 'a')).toEqual({ b: true });
  });
});

describe('loadContacted / saveContacted', () => {
  beforeEach(() => localStorage.clear());

  it('returns {} when nothing stored', () => {
    expect(loadContacted()).toEqual({});
  });

  it('returns {} when stored value is invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json');
    expect(loadContacted()).toEqual({});
  });

  it('round-trips through save and load', () => {
    saveContacted({ a: true, b: true });
    expect(loadContacted()).toEqual({ a: true, b: true });
  });
});
