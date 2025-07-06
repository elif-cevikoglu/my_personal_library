import React, { useEffect, useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

const EditBook = ({ isOpen, onClose, onSuccess, bookId }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [isRead, setIsRead] = useState(false);
  const [pageCount, setPageCount] = useState('');
  const [currentPage, setCurrentPage] = useState('');
  const [startedReading, setStartedReading] = useState('');
  const [finishedReading, setFinishedReading] = useState('');
  const [language, setLanguage] = useState('');
  const [rating, setRating] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookId && isOpen) {
      API.get(`/api/books/${bookId}/`)
        .then((res) => {
          const book = res.data;
          setTitle(book.title);
          setAuthor(book.author);
          setGenre(book.genre || '');
          setDescription(book.description || '');
          setIsRead(book.is_read);
          setPageCount(book.page_count || '');
          setCurrentPage(book.current_page || '');
          setStartedReading(book.started_reading || '');
          setFinishedReading(book.finished_reading || '');
          setLanguage(book.language || '');
          setRating(book.rating || '');
          setCoverImage(book.cover_image || '');
        })
        .catch((err) => {
          console.error(err);
          toast.error('Failed to load book');
        });
    }
  }, [bookId, isOpen]);

  useEffect(() => {
    if (pageCount !== '' && currentPage !== '' && Number(pageCount) === Number(currentPage)) {
      setIsRead(true);
    } else {
      setIsRead(false);
    }
  }, [pageCount, currentPage]);

  useEffect(() => {
    if (isRead && pageCount !== '') {
      setCurrentPage(pageCount);
    }
  }, [isRead]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (pageCount && isNaN(pageCount)) {
      toast.error('Page count must be a number');
      setLoading(false);
      return;
    }

    if (currentPage && isNaN(currentPage)) {
      toast.error('Current page must be a number');
      setLoading(false);
      return;
    }

    if (rating && (isNaN(rating) || rating < 0 || rating > 10)) {
      toast.error('Rating must be a number between 0 and 10');
      setLoading(false);
      return;
    }

    try {
      await API.put(`/api/books/${bookId}/`, {
        title,
        author,
        genre: genre || '',
        description: description || '',
        is_read: isRead,
        page_count: pageCount !== '' ? Number(pageCount) : null,
        current_page: currentPage !== '' ? Number(currentPage) : null,
        started_reading: startedReading || null,
        finished_reading: finishedReading || null,
        language: language || '',
        rating: rating !== '' ? Number(rating) : null,
        cover_image: coverImage || '',
      });

      toast.success('✅ Book updated!');
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      if (err.response?.data) {
        const messages = Object.entries(err.response.data)
          .map(([key, val]) => `${key}: ${val}`)
          .join('\n');
        toast.error(`Validation error:\n${messages}`);
      } else {
        toast.error('Failed to update book');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-700/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute text-4xl cursor-pointer -top-1 right-2 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Edit Book</h2>
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-gray-700 mb-1">Basic Info</legend>
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input type="text" className="w-full border rounded px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-medium">Author</label>
              <input type="text" className="w-full border rounded px-3 py-2" value={author} onChange={(e) => setAuthor(e.target.value)} required disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-medium">Genre</label>
              <input type="text" className="w-full border rounded px-3 py-2" value={genre} onChange={(e) => setGenre(e.target.value)} disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea rows="3" className="w-full border rounded px-3 py-2" value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading}></textarea>
            </div>
          </fieldset>

          <fieldset className="grid grid-cols-2 gap-4">
            <legend className="col-span-2 text-sm font-semibold text-gray-700 mb-1">Reading Progress</legend>
            <div>
              <label className="block text-sm font-medium">Page Count</label>
              <input type="number" className="w-full border rounded px-3 py-2" value={pageCount} onChange={(e) => setPageCount(e.target.value)} disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-medium">Current Page</label>
              <input type="number" className="w-full border rounded px-3 py-2" value={currentPage} onChange={(e) => setCurrentPage(e.target.value)} disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-medium">Started Reading</label>
              <input type="date" className="w-full border rounded px-3 py-2" value={startedReading} onChange={(e) => setStartedReading(e.target.value)} disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-medium">Finished Reading</label>
              <input type="date" className="w-full border rounded px-3 py-2" value={finishedReading} onChange={(e) => setFinishedReading(e.target.value)} disabled={loading} />
            </div>
          </fieldset>

          <fieldset className="grid grid-cols-2 gap-4">
            <legend className="col-span-2 text-sm font-semibold text-gray-700 mb-1">Additional Info</legend>
            <div>
              <label className="block text-sm font-medium">Language</label>
              <input type="text" className="w-full border rounded px-3 py-2" value={language} onChange={(e) => setLanguage(e.target.value)} disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-medium">Rating (0-10)</label>
              <input type="number" min="0" max="10" className="w-full border rounded px-3 py-2" value={rating} onChange={(e) => setRating(e.target.value)} disabled={loading} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium">Cover Image URL</label>
              <input type="text" className="w-full border rounded px-3 py-2" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} disabled={loading} />
            </div>
          </fieldset>

          <div className="flex items-center">
            <input type="checkbox" id="isRead" className="mr-2" checked={isRead} onChange={(e) => setIsRead(e.target.checked)} disabled={loading} />
            <label htmlFor="isRead" className="text-sm">Mark as Read</label>
          </div>

          <button type="submit" className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBook;
