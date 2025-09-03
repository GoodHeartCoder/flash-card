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
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;
