import React, { useCallback, useMemo } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import '../styles/MarkdownEditor.css';

function MarkdownEditor({ value, onChange }) {
  const handleChange = useCallback((value) => {
    onChange(value);
  }, [onChange]);

  const options = useMemo(() => ({
    spellChecker: false,
    placeholder: "Write your post content here...",
    status: ['lines', 'words', 'cursor'],
    toolbar: [
      'bold', 'italic', 'heading', '|', 
      'quote', 'unordered-list', 'ordered-list', '|',
      'link', 'image', '|',
      'preview', 'side-by-side', 'fullscreen'
    ]
  }), []);

  return (
    <SimpleMDE
      value={value}
      onChange={handleChange}
      options={options}
    />
  );
}

export default MarkdownEditor;