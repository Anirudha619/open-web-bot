export function ChatBotAvatar({ size = 40, logoUrl }: { size?: number; logoUrl?: string }) {
  if (logoUrl) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <img
          src={logoUrl}
          alt="Bot logo"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  }

  const iconSize = size * 0.6;

  return (
    <div
      style={{
        width: size,
        height: size,
        background: "#000",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width={iconSize}
        height={iconSize}
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="7" width="16" height="12" rx="3" />
        <circle cx="9" cy="13" r="2" fill="#fff" stroke="none" />
        <circle cx="15" cy="13" r="2" fill="#fff" stroke="none" />
      </svg>
    </div>
  );
}