import { useState } from 'react';

type Props = {
  slug: string;
  goesBy: string;
  size: number;
};

function hashColor(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 45%, 35%)`;
}

function initials(name: string): string {
  const chars = Array.from(name);
  return (chars[0] ?? '?').toUpperCase();
}

export function Avatar({ slug, goesBy, size }: Props) {
  const [errored, setErrored] = useState(false);
  const src = `${import.meta.env.BASE_URL}photos/${slug}.png`;
  if (errored) {
    return (
      <div
        style={{
          width: size,
          height: size,
          background: hashColor(slug),
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.45,
          fontWeight: 600,
          borderRadius: '50%',
          flexShrink: 0,
        }}
      >
        {initials(goesBy)}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt=""
      onError={() => setErrored(true)}
      width={size}
      height={size}
      style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
    />
  );
}
