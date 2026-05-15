export type Social = {
  twitter?: string;
  instagram?: string;
  bluesky?: string;
};

export type Link = {
  label: string;
  url: string;
};

export type Invitee = {
  slug: string;
  goesBy: string;
  hall: string;
  booth: string;
  languages: string[];
  blurb: string;
  socials: Social;
  links: Link[];
};

export type ContactedMap = Record<string, boolean>;

export type HallBucket = {
  hall: string;
  invitees: Invitee[];
};

export type GroupedInvitees = {
  halls: HallBucket[];
  contacted: Invitee[];
};
