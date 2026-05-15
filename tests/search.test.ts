import { describe, it, expect } from 'vitest';
import { filterBySearch } from '../src/lib/search';
import type { Invitee } from '../src/lib/types';

const stub = (goesBy: string): Invitee => ({
  slug: goesBy.toLowerCase(),
  goesBy,
  hall: 'Hall 3',
  booth: 'X',
  languages: ['English'],
  blurb: '',
  socials: {},
  links: [],
});

describe('filterBySearch', () => {
  const list = [stub('BANGSOM'), stub('Beryl'), stub('appleseed先生')];

  it('returns all when query is empty', () => {
    expect(filterBySearch(list, '').length).toBe(3);
  });

  it('returns all when query is whitespace', () => {
    expect(filterBySearch(list, '   ').length).toBe(3);
  });

  it('matches case-insensitively', () => {
    expect(filterBySearch(list, 'bangsom').map(i => i.goesBy)).toEqual(['BANGSOM']);
  });

  it('matches substrings', () => {
    expect(filterBySearch(list, 'ery').map(i => i.goesBy)).toEqual(['Beryl']);
  });

  it('trims the query', () => {
    expect(filterBySearch(list, '  beryl  ').map(i => i.goesBy)).toEqual(['Beryl']);
  });

  it('matches non-latin characters', () => {
    expect(filterBySearch(list, '先生').map(i => i.goesBy)).toEqual(['appleseed先生']);
  });
});
