/**
 * 
 * A class that handles our buttons
 * 
 */

export default function Button({
  children,
  type = "button",
  variant = "primary",
  fullWidth = false,
  disabled = false,
  onClick,
}) {
  const className = [
    "bap-button",
    `bap-button-${variant}`,
    fullWidth ? "bap-button-full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}