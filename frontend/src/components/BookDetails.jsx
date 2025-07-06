import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';
import DeleteBook from './DeleteBook';
import ReadingSessionControls from './ReadingSessionControls';
import SessionHistory from './SessionHistory';
import SessionModal from './EditSessionModal';
import ReadingAnalytics from './ReadingAnalytics';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sessionsChanged, setSessionsChanged] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [activeTab, setActiveTab] = useState('session');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await API.get(`/api/books/${id}/`);
        setBook(res.data);
        setFormData(res.data);
      } catch (err) {
        toast.error('Failed to load book details');
      }
    };

    fetchBook();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    try {
      const res = await API.put(`/api/books/${id}/`, formData);
      toast.success('✅ Book updated');
      setBook(res.data);
      setEditing(false);
    } catch (err) {
      toast.error('Failed to update book');
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/api/books/${id}/`);
      toast.success('🗑️ Book deleted');
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete book');
    }
  };

  const updateSession = (updated) => {
    setSessionsChanged(true);
    setEditingSession(null);
    setSessionsChanged(false);
  };

  const deleteSession = (deletedId) => {
    setSessionsChanged(true);
    setEditingSession(null);
    setSessionsChanged(false);
  };

  const renderProgress = () => {
    const { current_page = 0, page_count = 0 } = book;
    const percent = page_count ? Math.min((current_page / page_count) * 100, 100) : 0;
    return (
      <div className="mt-4">
        <div className="text-sm text-gray-600 mb-1">
          Progress: {current_page ?? 0}/{page_count ?? '?'} pages
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div
            className="bg-green-500 h-full"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    );
  };

  if (!book) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-8">
        <div>
          {(book.cover_image || formData.cover_image) && (
            <img
              src={editing ? formData.cover_image : book.cover_image}
              alt="cover"
              className="w-64 h-96 object-cover rounded shadow-md sticky top-20"
            />
          )}
        </div>

        <div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="space-y-6">
              <h1 className="text-3xl font-semibold text-gray-800">
                {editing ? (
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="border px-3 py-2 w-full rounded"
                  />
                ) : (
                  book.title
                )}
              </h1>

              <p className="text-gray-600 italic">
                {editing ? (
                  <input
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="border px-3 py-2 w-full mt-2 rounded"
                  />
                ) : (
                  <>by {book.author}</>
                )}
              </p>

              {editing && (
                <input
                  name="cover_image"
                  value={formData.cover_image || ''}
                  onChange={handleInputChange}
                  placeholder="Cover Image URL"
                  className="border px-3 py-2 w-full rounded"
                />
              )}

              <div>
                <label className="font-medium text-gray-700">Description:</label>
                {editing ? (
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    className="border px-3 py-2 w-full mt-1 rounded"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-800 mt-1 whitespace-pre-line">{book.description || 'N/A'}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">Genre:</label>
                  {editing ? (
                    <input name="genre" value={formData.genre || ''} onChange={handleInputChange} className="border px-3 py-2 w-full mt-1 rounded" />
                  ) : (
                    <p className="text-gray-800 mt-1">{book.genre || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="font-medium text-gray-700">Language:</label>
                  {editing ? (
                    <input name="language" value={formData.language || ''} onChange={handleInputChange} className="border px-3 py-2 w-full mt-1 rounded" />
                  ) : (
                    <p className="text-gray-800 mt-1">{book.language || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="font-medium text-gray-700">Pages:</label>
                  {editing ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        name="current_page"
                        value={formData.current_page ?? ''}
                        onChange={handleInputChange}
                        className="border px-3 py-2 w-20 rounded"
                      />
                      /
                      <input
                        type="number"
                        name="page_count"
                        value={formData.page_count ?? ''}
                        onChange={handleInputChange}
                        className="border px-3 py-2 w-20 rounded"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-800 mt-1">{book.current_page ?? 0} / {book.page_count ?? '?'}</p>
                  )}
                </div>
                <div>
                  <label className="font-medium text-gray-700">Status:</label>
                  {editing ? (
                    <label className="inline-flex items-center mt-1">
                      <input
                        type="checkbox"
                        name="is_read"
                        checked={formData.is_read}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      {formData.is_read ? 'Read' : 'Unread'}
                    </label>
                  ) : (
                    <p className="text-gray-800 mt-1">{book.is_read ? '✅ Read' : '📖 Unread'}</p>
                  )}
                </div>
                <div>
                  <label className="font-medium text-gray-700">Rating:</label>
                  {editing ? (
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating ?? ''}
                      onChange={handleInputChange}
                      className="border px-3 py-2 w-20 mt-1 rounded"
                    />
                  ) : (
                    <p className="text-gray-800 mt-1">{book.rating ?? '?'} / 10</p>
                  )}
                </div>
              </div>

              {renderProgress()}

              <div className="flex gap-4 mt-6 justify-end">
                {editing ? (
                  <>
                    <button onClick={() => setEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
                    <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setIsDeleteModalOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
                    <button onClick={() => setEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edit</button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex border-b mb-4">
              <button
                onClick={() => setActiveTab('session')}
                className={`px-4 py-2 font-medium ${activeTab === 'session' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                Reading Session
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 font-medium ${activeTab === 'history' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                Session History
              </button>
            </div>

            {activeTab === 'session' && (
              <ReadingSessionControls
                bookId={id}
                onSessionAdded={() => {
                  setSessionsChanged(true);
                  setSessionsChanged(false)
                }}
              />
            )}

            {activeTab === 'history' && (
              <SessionHistory
                bookId={id}
                onEdit={setEditingSession}
                refreshKey={sessionsChanged}
                onRefreshed={() => {
                  setSessionsChanged(true);
                  setSessionsChanged(false)
                }}
              />
            )}
          </div>

          <DeleteBook
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
          />

          {editingSession && (
            <SessionModal
              session={editingSession}
              onClose={() => setEditingSession(null)}
              onSave={updateSession}
            />
          )}
        </div>
      </div>
        <ReadingAnalytics bookId={id} />
    </div>
  );
};

export default BookDetails;
