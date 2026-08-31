/**
 * 
 * A class that handles our Inputs
 * 
 */
export default function Input({
  label,
  ...props
}) {
  return (
    <div className="bap-input-group">
      {label && (
        <label className="bap-input-label">
          {label}
        </label>
      )}

      <input
        className="bap-input"
        {...props}
      />
    </div>
  );
}