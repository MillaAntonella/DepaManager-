import React from 'react';

const Form = ({ onSubmit, children, className = '' }) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className}`}>
      {children}
    </form>
  );
};

const FormField = ({ label, children, error }) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

const Input = ({ type = 'text', ...props }) => {
  return (
    <input
      type={type}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
      {...props}
    />
  );
};

const Select = ({ children, ...props }) => {
  return (
    <select
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
      {...props}
    >
      {children}
    </select>
  );
};

const TextArea = ({ ...props }) => {
  return (
    <textarea
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 resize-none"
      rows="4"
      {...props}
    />
  );
};

export { Form, FormField, Input, Select, TextArea };