import { useState } from 'react';
import type { Invitee } from '../lib/types';
import { Avatar } from './Avatar';

type Props = {
  invitee: Invitee;
  contacted: boolean;
  onToggleContacted: (slug: string) => void;
};

function socialUrl(platform: 'twitter' | 'instagram' | 'bluesky', handle: string): string {
  const h = handle.replace(/^@/, '');
  if (platform === 'twitter') return `https://x.com/${h}`;
  if (platform === 'instagram') return `https://www.instagram.com/${h}/`;
  return `https://bsky.app/profile/${h}`;
}

export function InviteeCard({ invitee, contacted, onToggleContacted }: Props) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="card"
      style={{ opacity: contacted ? 0.6 : 1 }}
    >
      <button className="card-header" onClick={() => setExpanded(e => !e)} aria-expanded={expanded}>
        <Avatar slug={invitee.slug} goesBy={invitee.goesBy} size={40} />
        <div className="card-header-text">
          <div className="card-name">{invitee.goesBy}</div>
          <div className="card-booth">{invitee.booth}</div>
        </div>
      </button>
      {expanded && (
        <div className="card-body">
          <div className="card-photo">
            <Avatar slug={invitee.slug} goesBy={invitee.goesBy} size={120} />
          </div>
          <div className="card-meta">
            <div className="card-booth-large">{invitee.booth}</div>
            <div className="chips">
              {invitee.languages.map(lang => (
                <span key={lang} className="chip">{lang}</span>
              ))}
            </div>
          </div>
          <p className="card-blurb">{invitee.blurb}</p>
          {(invitee.socials.twitter || invitee.socials.instagram || invitee.socials.bluesky) && (
            <div className="card-section">
              <div className="card-section-label">Socials</div>
              <div className="card-links">
                {invitee.socials.twitter && (
                  <a href={socialUrl('twitter', invitee.socials.twitter)} target="_blank" rel="noreferrer">
                    Twitter {invitee.socials.twitter}
                  </a>
                )}
                {invitee.socials.instagram && (
                  <a href={socialUrl('instagram', invitee.socials.instagram)} target="_blank" rel="noreferrer">
                    Instagram {invitee.socials.instagram}
                  </a>
                )}
                {invitee.socials.bluesky && (
                  <a href={socialUrl('bluesky', invitee.socials.bluesky)} target="_blank" rel="noreferrer">
                    Bluesky {invitee.socials.bluesky}
                  </a>
                )}
              </div>
            </div>
          )}
          {invitee.links.length > 0 && (
            <div className="card-section">
              <div className="card-section-label">Other links</div>
              <div className="card-links">
                {invitee.links.map(link => (
                  <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="chip-link">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
          <button className="card-action" onClick={() => onToggleContacted(invitee.slug)}>
            {contacted ? 'Mark not contacted' : 'Mark contacted'}
          </button>
        </div>
      )}
    </div>
  );
}
