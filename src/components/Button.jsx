import LoadingSpinner from "./LoadingSpinner"; // Adjust path as needed

const SIZES = {
  sm: { fontSize: "0.875rem", padding: "0.375rem 0.75rem" },
  md: { fontSize: "1rem", padding: "0.5rem 1rem" },
  lg: { fontSize: "1.25rem", padding: "0.75rem 1.5rem" },
  xl: { fontSize: "1.5rem", padding: "1rem 2rem" },
};

function Button({
  text = "Button",
  size = "sm",
  color = "#fff",
  bgColor = "#007bff",
  className = "",
  borderRadius = "5px",
  onClick,
  disabled = false,
  loading = false,
}) {
  return (
    <button
      className={className}
      style={{
        color,
        background: bgColor,
        ...SIZES[size],
        borderRadius,
        border: "1px solid",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        cursor: loading || disabled ? "not-allowed" : "pointer",
        opacity: disabled && !loading ? 0.6 : 1,
      }}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
    >
      {loading ? <LoadingSpinner size="md" color="#fff" /> : text}
    </button>
  );
}

export default Button;
