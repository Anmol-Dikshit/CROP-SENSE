export default function InputCard({ label, name, value, handleChange }) {
  return (
    <div>
      <label className="block font-medium mb-2">
        {label}
      </label>

      <input
        type="number"
        step="any"
        name={name}
        value={value}
        onChange={handleChange}
        required
        className="w-full border rounded-lg p-3"
        placeholder={`Enter ${label}`}
      />
    </div>
  );
}