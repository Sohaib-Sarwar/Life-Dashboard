import React from 'react';

const Input = ({ 
  type = 'text', 
  name,
  placeholder, 
  value, 
  onChange, 
  className = '',
  required = false,
  disabled = false 
}) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    />
  );
};

export default Input;
