import React from 'react';
import BookItem from './BookItem';

/**
 * BookList Component
 * Displays the reading list, a loading message, or an empty state message.
 */
export default function BookList({ books, isLoading, onMarkAsRead, onDeleteBook }) {
  if (isLoading) {
    return (
      <div>
        <h2 className="text-lg font-semibold">Your books</h2>
        <p className="text-gray-600 mt-2">Loading your books…</p>
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-semibold">Your books</h2>
        <p className="text-gray-600 mt-2">No books yet. Add your first one above.</p>
      </div>
    );
  }

  const readCount = books.filter((b) => b.status === 'read').length;
  const unreadCount = books.length - readCount;

  return (
    <div>
      <h2 className="text-lg font-semibold">Your books ({books.length})</h2>
      <p className="text-sm text-gray-600 mt-1">
        {readCount} read, {unreadCount} unread
      </p>

      <ul className="mt-2 divide-y divide-gray-200 border-y border-gray-200" role="list" aria-label="Book list">
        {books.map((book) => (
          <BookItem
            key={book.id}
            book={book}
            onMarkAsRead={onMarkAsRead}
            onDeleteBook={onDeleteBook}
          />
        ))}
      </ul>
    </div>
  );
}
