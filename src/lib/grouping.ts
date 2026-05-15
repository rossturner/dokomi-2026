import type { Invitee, ContactedMap, GroupedInvitees } from './types';

function hallNumber(hall: string): number {
  const match = hall.match(/(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

export function groupAndSortByHall(
  invitees: Invitee[],
  contacted: ContactedMap,
): GroupedInvitees {
  const contactedList: Invitee[] = [];
  const byHall = new Map<string, Invitee[]>();

  for (const invitee of invitees) {
    if (contacted[invitee.slug]) {
      contactedList.push(invitee);
      continue;
    }
    const bucket = byHall.get(invitee.hall) ?? [];
    bucket.push(invitee);
    byHall.set(invitee.hall, bucket);
  }

  const halls = Array.from(byHall.entries())
    .map(([hall, list]) => ({ hall, invitees: list }))
    .sort((a, b) => hallNumber(a.hall) - hallNumber(b.hall));

  return { halls, contacted: contactedList };
}
