import React, { useState } from "react";

const avatars = [
  { id: 1, src: "https://via.placeholder.com/100" },
  { id: 2, src: "https://via.placeholder.com/100" },
  { id: 3, src: "https://via.placeholder.com/100" },
  { id: 4, src: "https://via.placeholder.com/100" },
  { id: 5, src: "https://via.placeholder.com/100" },
];

export default function AvatarSelector() {
  const [selected, setSelected] = useState(null);

  const handleSelect = (id) => {
    setSelected(id);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200 rounded mb-4">
        <div className="h-1 bg-orange-600 rounded w-1/3"></div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold mb-1">Select Avatar</h2>
      <p className="text-sm text-gray-500 mb-4">
        Choose the figure that represents you
      </p>

      {/* Scroll container */}

      {/* added scroll smooth for smooth scrolling March 29 2026 */}
      <div className="flex space-x-4 overflow-x-auto pb-2 scroll-smooth">
        {avatars.map((avatar) => (
          <div
            key={avatar.id}
            onClick={() => handleSelect(avatar.id)}
            className={`relative min-w-[100px] h-[100px] rounded-xl cursor-pointer border-2 flex items-center justify-center transition
              ${
                selected === avatar.id ? "border-orange-600" : "border-gray-200"
              }`}
          >
            <img
              src={avatar.src}
              alt="avatar"
              className="w-full h-full object-cover rounded-xl"
            />

            {/* Checkbox indicator */}
            {selected === avatar.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-orange-600 text-white text-xs flex items-center justify-center rounded-full">
                ✓
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
