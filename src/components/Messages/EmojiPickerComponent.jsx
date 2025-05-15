import React, { useEffect, useRef, useState } from "react";
import EmojiPicker, { Emoji } from "emoji-picker-react";

export default function EmojiPickerComponent({ onSelectEmoji }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTrigger = (e) => {
    e.preventDefault();
    setPickerOpen((prev) => !prev);
  };

  return (
    <div className="relative flex">
      <button
        ref={buttonRef}
        className="text-[#98A6AD] hover:text-body"
        onClick={handleTrigger}
      >
        <i className="pi pi-face-smile"></i>
      </button>

      {pickerOpen && (
        <div ref={pickerRef} className="absolute z-40 -top-115 right-0">
          <EmojiPicker onEmojiClick={(emojiData) => onSelectEmoji(emojiData.emoji)} />
        </div>
      )}
    </div>
  );
}

