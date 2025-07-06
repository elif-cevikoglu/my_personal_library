import React, { useEffect, useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import FilterControls from './FilterControls';
import VisualControls from './VisualControls';
import PaginationControls from './PaginationControls';
import BookCard from './BookCard';
import AddBook from './AddBook';
import EditBook from './EditBook';
import DeleteBook from './DeleteBook';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ordering, setOrdering] = useState('');
  const [genre, setGenre] = useState('');
  const [isRead, setIsRead] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingBookId, setDeletingBookId] = useState(null);
  const [view, setView] = useState('grid');

  const buildQuery = (page = 1) => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (ordering) params.append('ordering', ordering);
    if (genre) params.append('genre', genre);
    if (isRead !== '') params.append('is_read', isRead);
    params.append('page_size', pageSize);
    params.append('page', page);
    return `/api/books/?${params.toString()}`;
  };

  const fetchBooks = async (page = 1) => {
    try {
      const res = await API.get(buildQuery(page));
      setBooks(res.data.results);
      setCount(res.data.count);
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load books');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setOrdering('');
    setGenre('');
    setIsRead('');
    setPageSize(5);
    fetchBooks(1);
  };

  const openEditModal = (bookId) => {
    setEditingBookId(bookId);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (bookId) => {
    setDeletingBookId(bookId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/api/books/${deletingBookId}/`);
      toast.success('🗑️ Book deleted');
      fetchBooks(currentPage);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete book');
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingBookId(null);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 cursor-pointer text-white font-medium px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Add Book
        </button>
      </div>

      <FilterControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        ordering={ordering}
        setOrdering={setOrdering}
        genre={genre}
        setGenre={setGenre}
        isRead={isRead}
        setIsRead={setIsRead}
        pageSize={pageSize}
        setPageSize={setPageSize}
        onApplyFilters={() => fetchBooks(1)}
        onClearFilters={clearFilters}
      />

      <VisualControls view={view} setView={setView} />

      <div
        className={
          view === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'flex flex-col gap-4'
        }
      >
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            view={view}
            onEdit={() => openEditModal(book.id)}
            onDelete={() => openDeleteModal(book.id)}
          />
        ))}
      </div>

      <PaginationControls
        count={count}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={fetchBooks}
      />

      <AddBook
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchBooks(currentPage)}
      />

      <EditBook
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => fetchBooks(currentPage)}
        bookId={editingBookId}
      />

      <DeleteBook
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default BookList;
