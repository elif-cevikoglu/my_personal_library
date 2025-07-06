import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import axios from 'axios';

const languageNames = new Intl.DisplayNames(['en'], {
  type: 'language'
});

const AddBook = ({ isOpen, onClose, onSuccess }) => {
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [manualEntry, setManualEntry] = useState(false);
  const [searching, setSearching] = useState(false);

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

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setGenre('');
    setDescription('');
    setIsRead(false);
    setPageCount('');
    setCurrentPage('');
    setStartedReading('');
    setFinishedReading('');
    setLanguage('');
    setRating('');
    setCoverImage('');
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(res.data.items || []);
    } catch (err) {
      console.error(err);
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectBook = (item) => {
    const info = item.volumeInfo;
    setTitle(info.title || '');
    setAuthor((info.authors && info.authors.join(', ')) || '');
    setPageCount(info.pageCount || '');
    setLanguage(languageNames.of(info.language || '') || '');
    setCoverImage(info.imageLinks?.thumbnail || '');
    setDescription(info.description || '');
    setManualEntry(true);
  };

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
      await API.post('/api/books/', {
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

      toast.success('📚 Book added!');
      resetForm();
      setManualEntry(false);
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
        toast.error('Failed to add book');
      }
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    resetForm();
    setSearchQuery('');
    setSearchResults([]);
    setManualEntry(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-700/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute text-4xl cursor-pointer -top-1 right-2 text-gray-500 hover:text-red-500"
          onClick={closeModal}
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Add a New Book</h2>

        {!manualEntry && (
          <div className="space-y-2 mb-4">
            <input
              type="text"
              placeholder="Search for a book..."
              className="w-full border px-3 py-2 rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
            {searchResults.length > 0 && (
              <ul className="max-h-48 overflow-y-auto text-sm">
                {searchResults.map((item, idx) => (
                  <li
                    key={idx}
                    className="cursor-pointer px-2 py-2 flex items-center gap-2 border-b hover:bg-gray-100"
                    onClick={() => handleSelectBook(item)}
                  >
                    {item.volumeInfo.imageLinks?.thumbnail && (
                      <img
                        src={item.volumeInfo.imageLinks.thumbnail}
                        alt="cover"
                        className="w-8 h-10 object-cover flex-shrink-0 rounded"
                      />
                    )}
                    <div>
                      <div className="font-medium">{item.volumeInfo.title}</div>
                      {item.volumeInfo.authors?.length && (
                        <div className="text-gray-600 text-xs">by {item.volumeInfo.authors[0]}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button
              className="text-sm cursor-pointer underline text-center block mx-auto mt-2"
              onClick={() => {
                resetForm();
                setManualEntry(true);
              }}
            >
              Or enter manually
            </button>
          </div>
        )}

        {manualEntry && (
          <button
            onClick={() => setManualEntry(false)}
            className="mb-4 cursor-pointer text-sm text-blue-600 underline"
          >
            ← Go back to search
          </button>
        )}

        {manualEntry && (
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
              {loading ? 'Saving...' : 'Add Book'}
            </button>
          </form>
        )}

        {searching && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
            <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-200 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBook;
