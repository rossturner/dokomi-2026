import { useState } from 'react';
import type { Invitee } from '../lib/types';
import { InviteeCard } from './InviteeCard';

type Props = {
  title: string;
  invitees: Invitee[];
  contactedMap: Record<string, boolean>;
  onToggleContacted: (slug: string) => void;
  defaultOpen: boolean;
  hideCount?: boolean;
};

export function HallSection({ title, invitees, contactedMap, onToggleContacted, defaultOpen, hideCount }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  if (invitees.length === 0) return null;
  return (
    <section className="hall">
      <button className="hall-header" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span>{title}</span>
        {!hideCount && <span className="hall-count">{invitees.length}</span>}
      </button>
      {open && (
        <div className="hall-body">
          {invitees.map(invitee => (
            <InviteeCard
              key={invitee.slug}
              invitee={invitee}
              contacted={!!contactedMap[invitee.slug]}
              onToggleContacted={onToggleContacted}
            />
          ))}
        </div>
      )}
    </section>
  );
}
