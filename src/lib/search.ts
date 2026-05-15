import type { Invitee } from './types';

export function filterBySearch(invitees: Invitee[], query: string): Invitee[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return invitees;
  return invitees.filter(i => i.goesBy.toLowerCase().includes(trimmed));
}
