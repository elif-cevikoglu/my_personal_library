import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book, onEdit, onDelete, view = 'grid' }) => {
  const getShortDescription = (desc) => {
    if (!desc) return '';
    return desc.length > 100 ? desc.slice(0, (view === 'list' ? 180 : 100)) + '...' : desc;
  };

  const coverImage = book.cover_image?.trim()
    ? book.cover_image
    : 'https://www.mountaineers.org/images/placeholder-images/placeholder-300-x-400/@@images/151d159c-90de-4a09-bc10-b18928419e88.jpeg';

  const progress =
    book.page_count && book.current_page
      ? Math.min((book.current_page / book.page_count) * 100, 100)
      : 0;

  const Description = () => (
    <div
      className={`text-gray-500 mt-1 line-clamp-2 min-h-[3em] ${
        view === 'list' ? 'max-w-2xl' : ''
      }`}
    >
      {book.description ? getShortDescription(book.description) : '\u00A0'}
    </div>
  );

  const InfoGrid = ({ view }) => (
    <div
      className={`grid grid-cols-2 gap-2 text-sm text-gray-700 ${
        view === 'list' ? 'max-w-xs' : ''
      }`}
    >
      {book.genre && (
        <div>
          🎭 <strong>{book.genre}</strong>
        </div>
      )}
      <div>{book.is_read ? '✅ Read' : '📖 Unread'}</div>
      <div>
        🌐 Language: <strong>{book.language ?? '?'}</strong>
      </div>
      <div>
        ⭐ Rating: <strong>{book.rating ?? '? ' }/ 10</strong>
      </div>
      <div className="col-span-2">
        📄 {book.current_page ?? 0}/{book.page_count ?? '?'} pages
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit();
  }

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  }

  if (view === 'list') {
    return (
      <Link to={`/books/${book.id}`} className="block hover:no-underline text-inherit">
        <div className="bg-white rounded-lg shadow-md border p-4 flex gap-6 hover:shadow-lg transition">
          <img
            src={coverImage}
            alt={`${book.title} cover`}
            className="w-42 h-64 object-cover rounded flex-shrink-0"
          />
          <div className="flex flex-col justify-between flex-grow">
            <div>
              <h3 className="text-xl font-semibold leading-tight">{book.title}</h3>
              <p className="text-gray-600 italic mb-1">by {book.author}</p>
              <InfoGrid view={view} />
              <Description />
            </div>
            <div className="flex gap-2 mt-3 self-end">
              <button
                onClick={handleEdit}
                className="bg-indigo-600 cursor-pointer text-white px-4 py-1.5 rounded-md text-sm hover:bg-indigo-700"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 cursor-pointer text-white px-4 py-1.5 rounded-md text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/books/${book.id}`} className="block hover:no-underline text-inherit">
      <div className="bg-white rounded-lg shadow-md border p-4 hover:shadow-lg transition space-y-2">
        <img
          src={coverImage}
          alt={`${book.title} cover`}
          className="w-64 h-96 object-cover rounded justify-self-center"
        />

        <h3 className="text-xl font-semibold">{book.title}</h3>
        <p className="text-gray-600 italic">by {book.author}</p>

        <InfoGrid view={view} />
        <Description />

        <div className="flex gap-2 mt-2 justify-self-end">
          <button
            onClick={handleEdit}
            className="bg-indigo-600 cursor-pointer text-white px-4 py-1.5 rounded-md text-sm hover:bg-indigo-700"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 cursor-pointer text-white px-4 py-1.5 rounded-md text-sm hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
