import React, { useState } from 'react';

/**
 * BookItem Component
 * Renders an individual book with title, author, status badge,
 * "Mark as read" button (disabled when read), and "Delete" button.
 */
export default function BookItem({ book, onMarkAsRead, onDeleteBook }) {
  const [isMarking, setIsMarking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isRead = book.status === 'read';

  const handleMarkRead = async () => {
    if (isRead || isMarking) return;
    try {
      setIsMarking(true);
      await onMarkAsRead(book.id);
    } finally {
      setIsMarking(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      await onDeleteBook(book.id);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date cleanly
  const formattedDate = book.createdAt
    ? new Date(book.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <li className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Book Details */}
      <div className="min-w-0">
        <h3
          className={`font-semibold break-words ${isRead ? 'text-gray-500' : 'text-gray-900'}`}
          title={book.title}
        >
          {book.title}
        </h3>
        <p className="text-sm text-gray-600">by {book.author}</p>
        <p className="text-sm text-gray-500 mt-1">
          <span className={isRead ? 'text-green-700 font-medium' : 'text-amber-700 font-medium'}>
            {isRead ? 'Read' : 'Unread'}
          </span>
          {formattedDate && <span className="ml-3">Added {formattedDate}</span>}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Mark as Read Button */}
        {!isRead ? (
          <button
            type="button"
            onClick={handleMarkRead}
            disabled={isMarking || isDeleting}
            className="px-3 py-1.5 rounded border border-gray-300 text-sm hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Mark "${book.title}" as read`}
          >
            {isMarking ? 'Saving…' : 'Mark as read'}
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="hidden sm:inline-block px-3 py-1.5 rounded border border-gray-200 text-sm text-gray-400 cursor-not-allowed"
            aria-label="Already read"
          >
            Read
          </button>
        )}

        {/* Delete Button */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting || isMarking}
          className="px-3 py-1.5 rounded border border-gray-300 text-sm text-red-700 hover:bg-red-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label={`Delete "${book.title}"`}
        >
          {isDeleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </li>
  );
}
