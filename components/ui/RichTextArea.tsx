import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';

interface RichTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface RichTextAreaRef {
  applyStyle: (style: 'bold' | 'italic' | 'underline') => void;
  editorRef: React.RefObject<HTMLDivElement>;
}

export const RichTextArea = forwardRef<RichTextAreaRef, RichTextAreaProps>(
  ({ value, onChange, placeholder, className }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = value;
      }
    }, [value]);

    const handleInput = () => {
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
      if (editorRef.current && editorRef.current.innerHTML === placeholder) {
        editorRef.current.innerHTML = '';
      }
    };

    const handleBlur = () => {
      setIsFocused(false);
      if (editorRef.current && editorRef.current.innerHTML.trim() === '') {
        editorRef.current.innerHTML = placeholder || '';
      }
    };

    const applyStyle = (style: 'bold' | 'italic' | 'underline') => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const parentElement = range.commonAncestorContainer.parentElement;

        if (parentElement === editorRef.current) {
          // If the selection is directly inside the editor, wrap it with a new span
          const span = document.createElement('span');
          applyStyleToElement(span, style);
          range.surroundContents(span);
        } else if (parentElement && editorRef.current?.contains(parentElement)) {
          // If the selection is inside an existing styled span
          if (hasStyle(parentElement, style)) {
            // Remove the style if it's already applied
            removeStyle(parentElement, style);
          } else {
            // Add the new style
            applyStyleToElement(parentElement, style);
          }
        }

        handleInput();
      }
    };

    useImperativeHandle(ref, () => ({
      applyStyle,
      editorRef
    }));

    const applyStyleToElement = (element: HTMLElement, style: 'bold' | 'italic' | 'underline') => {
      switch (style) {
        case 'bold':
          element.style.fontWeight = element.style.fontWeight === 'bold' ? 'normal' : 'bold';
          break;
        case 'italic':
          element.style.fontStyle = element.style.fontStyle === 'italic' ? 'normal' : 'italic';
          break;
        case 'underline':
          element.style.textDecoration = element.style.textDecoration === 'underline' ? 'none' : 'underline';
          break;
      }
    };

    const removeStyle = (element: HTMLElement, style: 'bold' | 'italic' | 'underline') => {
      switch (style) {
        case 'bold':
          element.style.fontWeight = 'normal';
          break;
        case 'italic':
          element.style.fontStyle = 'normal';
          break;
        case 'underline':
          element.style.textDecoration = 'none';
          break;
      }
    };

    const hasStyle = (element: HTMLElement, style: 'bold' | 'italic' | 'underline') => {
      switch (style) {
        case 'bold':
          return element.style.fontWeight === 'bold';
        case 'italic':
          return element.style.fontStyle === 'italic';
        case 'underline':
          return element.style.textDecoration === 'underline';
      }
    };

    return (
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`rich-text-area border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className} ${
          !isFocused && (!value || value === placeholder) ? 'text-gray-400' : ''
        }`}
      >
        {!value && placeholder}
      </div>
    );
  }
);

RichTextArea.displayName = 'RichTextArea';