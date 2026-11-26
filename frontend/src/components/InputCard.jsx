import React from "react";

export default function InputCard({ label, name, value, handleChange }) {
  return (
    <div className="group">
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-[#365541] mb-2"
      >
        {label}
      </label>

      <input
        id={name}
        type="number"
        name={name}
        value={value}
        onChange={handleChange}
        required
        step="any"
        placeholder={`Enter ${label}`}
        className="w-full px-4 py-3.5 rounded-xl border border-[#dce8d9]
        bg-[#f9fcf7] text-[#234b32] outline-none
        transition-all duration-300
        focus:border-[#39965a] focus:ring-4 focus:ring-green-100
        hover:border-green-400"
      />
    </div>
  );
}