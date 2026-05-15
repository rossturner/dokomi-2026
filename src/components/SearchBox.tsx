type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBox({ value, onChange }: Props) {
  return (
    <input
      type="search"
      className="search"
      placeholder="Search by name"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}
