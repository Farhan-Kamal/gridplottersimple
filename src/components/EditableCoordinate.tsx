import React, { useState, useEffect } from 'react';

interface EditableCoordinateProps {
  value: number;
  onChange: (value: number) => void;
}

export default function EditableCoordinate({ value, onChange }: EditableCoordinateProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value.toString());

  useEffect(() => {
    setTempValue(value.toString());
  }, [value]);

  const handleBlur = () => {
    const newValue = parseInt(tempValue);
    if (!isNaN(newValue)) {
      onChange(newValue);
    } else {
      setTempValue(value.toString());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setTempValue(value.toString());
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="number"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-16 px-1 py-0.5 rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        autoFocus
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:text-blue-500 hover:underline"
    >
      {value}
    </span>
  );
}