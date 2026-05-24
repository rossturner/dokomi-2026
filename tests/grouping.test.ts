import { describe, it, expect } from 'vitest';
import { groupAndSortByHall } from '../src/lib/grouping';
import type { Invitee } from '../src/lib/types';

const stub = (slug: string, hall: string): Invitee => ({
  slug,
  goesBy: slug,
  hall,
  booth: 'X',
  languages: ['English'],
  blurb: '',
  socials: {},
  links: [],
  shopping: '',
});

describe('groupAndSortByHall', () => {
  it('groups invitees by hall and sorts halls numerically', () => {
    const result = groupAndSortByHall(
      [stub('a', 'Hall 10'), stub('b', 'Hall 3'), stub('c', 'Hall 5'), stub('d', 'Hall 3')],
      {},
    );
    expect(result.halls.map(h => h.hall)).toEqual(['Hall 3', 'Hall 5', 'Hall 10']);
    expect(result.halls[0].invitees.map(i => i.slug)).toEqual(['b', 'd']);
    expect(result.contacted).toEqual([]);
  });

  it('routes contacted invitees into the contacted bucket', () => {
    const result = groupAndSortByHall(
      [stub('a', 'Hall 3'), stub('b', 'Hall 3')],
      { a: true },
    );
    expect(result.halls[0].invitees.map(i => i.slug)).toEqual(['b']);
    expect(result.contacted.map(i => i.slug)).toEqual(['a']);
  });

  it('treats false / missing entries as not contacted', () => {
    const result = groupAndSortByHall([stub('a', 'Hall 3')], { a: false });
    expect(result.halls[0].invitees.map(i => i.slug)).toEqual(['a']);
    expect(result.contacted).toEqual([]);
  });
});
