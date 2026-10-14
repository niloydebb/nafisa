import React, { useState } from 'react';

/**
 * BookForm Component
 * Renders inputs for title and author with client-side validation,
 * inline error messages, and loading state during submission.
 */
export default function BookForm({ onAddBook }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Please add a title.';
    }
    if (!author.trim()) {
      newErrors.author = 'Please add an author.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const success = await onAddBook(title.trim(), author.trim());
      if (success) {
        setTitle('');
        setAuthor('');
        setErrors({});
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: '' }));
    }
  };

  const handleAuthorChange = (e) => {
    setAuthor(e.target.value);
    if (errors.author) {
      setErrors((prev) => ({ ...prev, author: '' }));
    }
  };

  const inputClass = (hasError) =>
    `w-full px-3 py-2 border rounded text-base bg-white disabled:bg-gray-100 focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-red-500 focus:ring-red-200'
        : 'border-gray-300 focus:border-blue-600 focus:ring-blue-200'
    }`;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Add a book</h2>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="book-title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            id="book-title"
            name="title"
            type="text"
            placeholder="e.g. The Pragmatic Programmer"
            value={title}
            onChange={handleTitleChange}
            disabled={isSubmitting}
            className={inputClass(errors.title)}
          />
          {errors.title && <p className="text-red-700 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="book-author" className="block text-sm font-medium mb-1">
            Author
          </label>
          <input
            id="book-author"
            name="author"
            type="text"
            placeholder="e.g. Andrew Hunt & David Thomas"
            value={author}
            onChange={handleAuthorChange}
            disabled={isSubmitting}
            className={inputClass(errors.author)}
          />
          {errors.author && <p className="text-red-700 text-sm mt-1">{errors.author}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white font-medium cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Adding…' : 'Add book'}
        </button>
      </form>
    </div>
  );
}
