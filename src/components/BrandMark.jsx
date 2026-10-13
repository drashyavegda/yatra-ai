export default function BrandMark({ size = 38 }) {
  return (
    <span className="brand-mark" style={{ width: size, height: size }} aria-hidden="true">
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 64 64" fill="none">
        <path d="M32 6l6 20 20 6-20 6-6 20-6-20-20-6 20-6z" fill="#d9ae3a" />
        <circle cx="32" cy="32" r="5" fill="#faf6ee" />
      </svg>
    </span>
  );
}
