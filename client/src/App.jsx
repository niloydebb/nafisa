import React, { useEffect, useReducer, useCallback } from 'react';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import { getBooks, createBook, markBookAsRead, deleteBook } from './api/books';

// Initial state
const initialState = {
  books: [],
  isLoading: true,
  error: null,
};

// Reducer function managing all bookshelf state
function booksReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_BOOKS':
      return {
        ...state,
        books: action.payload,
        isLoading: false,
        error: null,
      };
    case 'ADD_BOOK':
      // Prepend the new book to keep newest first
      return {
        ...state,
        books: [action.payload, ...state.books],
        error: null,
      };
    case 'MARK_READ':
      return {
        ...state,
        books: state.books.map((book) =>
          book.id === action.payload.id ? action.payload : book
        ),
        error: null,
      };
    case 'DELETE_BOOK':
      return {
        ...state,
        books: state.books.filter((book) => book.id !== action.payload),
        error: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(booksReducer, initialState);

  // Load books on mount
  const fetchBooks = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await getBooks();
      dispatch({ type: 'SET_BOOKS', payload: data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to fetch books.' });
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Handler: Add a new book
  const handleAddBook = async (title, author) => {
    try {
      const newBook = await createBook({ title, author });
      dispatch({ type: 'ADD_BOOK', payload: newBook });
      return true;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to add book.' });
      return false;
    }
  };

  // Handler: Mark book as read
  const handleMarkAsRead = async (id) => {
    try {
      const updatedBook = await markBookAsRead(id);
      dispatch({ type: 'MARK_READ', payload: updatedBook });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to update book status.' });
    }
  };

  // Handler: Delete book
  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id);
      dispatch({ type: 'DELETE_BOOK', payload: id });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to delete book.' });
    }
  };

  // Handler: Dismiss error banner
  const handleDismissError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <h1 className="text-2xl font-bold">BookShelf Manager</h1>
          <p className="text-sm text-gray-600 mt-1">Keep a list of the books you read.</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Dismissible Error Banner */}
        {state.error && (
          <div
            role="alert"
            className="mb-6 p-3 border border-red-300 bg-red-50 text-red-800 rounded flex items-start justify-between gap-3"
          >
            <p className="text-sm">{state.error}</p>
            <button
              type="button"
              onClick={handleDismissError}
              className="text-sm underline hover:no-underline cursor-pointer shrink-0"
              aria-label="Dismiss error banner"
            >
              Dismiss
            </button>
          </div>
        )}

        <section>
          <BookForm onAddBook={handleAddBook} />
        </section>

        <section className="mt-10">
          <BookList
            books={state.books}
            isLoading={state.isLoading}
            onMarkAsRead={handleMarkAsRead}
            onDeleteBook={handleDeleteBook}
          />
        </section>
      </main>
    </div>
  );
}
