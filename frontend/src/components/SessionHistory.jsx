import React, { useEffect, useState, useRef } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import PaginationControls from './PaginationControls';
import SessionControls from './SessionControls';
import SessionList from './SessionList';
import DeleteSessionModal from './DeleteSessionModal';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

const groupSessions = (sessions, mode) => {
  const grouped = {};
  sessions.forEach((s) => {
    const key =
      mode === 'day'
        ? dayjs(s.start_time).format('YYYY-MM-DD')
        : `Week ${dayjs(s.start_time).isoWeek()} - ${dayjs(s.start_time).year()}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(s);
  });
  return grouped;
};

const SessionHistory = ({ bookId, onEdit, refreshKey, onRefreshed }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');
  const [compact, setCompact] = useState(false);
  const [filterRange, setFilterRange] = useState('all');
  const [groupBy, setGroupBy] = useState('none');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const lastDeletedSessionRef = useRef(null);

  const filterByDateRange = (items) => {
    const now = dayjs();
    if (filterRange === '7d') {
      return items.filter((s) => dayjs(s.start_time).isAfter(now.subtract(7, 'day')));
    } else if (filterRange === '30d') {
      return items.filter((s) => dayjs(s.start_time).isAfter(now.subtract(30, 'day')));
    }
    return items;
  };

  const handleUndoDelete = async () => {
    const session = lastDeletedSessionRef.current;
    if (!session) return;
    try {
      await API.post('/api/reading-sessions/', session);
      toast.success('Undo successful');
      fetchSessions(currentPage, pageSize);
    } catch (err) {
      toast.error('Undo failed');
    } finally {
      lastDeletedSessionRef.current = null;
    }
  };

  const fetchSessions = async (page, size) => {
    setLoading(true);
    try {
      const res = await API.get(`/api/reading-sessions/?page=${page}&page_size=${size}`);
      let filtered = res.data.results.filter((s) => s.book === Number(bookId));
      filtered = filterByDateRange(filtered);
      filtered.sort((a, b) => {
        const t1 = new Date(a.start_time).getTime();
        const t2 = new Date(b.start_time).getTime();
        return sortOrder === 'asc' ? t1 - t2 : t2 - t1;
      });
      setSessions(filtered);
      setCount(res.data.count);
      setCurrentPage(page);
      onRefreshed?.();
    } catch (err) {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page !== currentPage) fetchSessions(page, pageSize);
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
    setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    const id = confirmDeleteId;
    const session = sessions.find((s) => s.id === id);
    lastDeletedSessionRef.current = session;
    setConfirmModalOpen(false);
    try {
      await API.delete(`/api/reading-sessions/${id}/`);
      toast.success(({ closeToast }) => (
        <span>
          Session deleted.
          <button onClick={() => { handleUndoDelete(); closeToast(); }} className="underline text-blue-200 ml-2">Undo</button>
        </span>
      ), { autoClose: 5000 });
      fetchSessions(currentPage, pageSize);
    } catch (err) {
      toast.error('Failed to delete session');
    }
  };

  useEffect(() => {
    fetchSessions(currentPage, pageSize);
  }, [currentPage, pageSize, sortOrder, filterRange]);

  useEffect(() => {
    if (refreshKey) fetchSessions(currentPage, pageSize);
  }, [refreshKey]);

  const groupedSessions = groupBy !== 'none' ? groupSessions(sessions, groupBy) : { '': sessions };

  return (
    <div className=" space-y-4 relative border rounded p-4 bg-white">
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-200 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 
              50 100.591C22.3858 100.591 0 78.2051 0 
              50.5908C0 22.9766 22.3858 0.59082 
              50 0.59082C77.6142 0.59082 100 22.9766 
              100 50.5908ZM9.08144 50.5908C9.08144 
              73.1895 27.4013 91.5094 50 
              91.5094C72.5987 91.5094 90.9186 
              73.1895 90.9186 50.5908C90.9186 
              27.9921 72.5987 9.67226 50 
              9.67226C27.4013 9.67226 9.08144 
              27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 
              97.8624 35.9116 97.0079 33.5539C95.2932 
              28.8227 92.871 24.3692 89.8167 
              20.348C85.8452 15.1192 80.8826 10.7238 
              75.2124 7.41289C69.5422 4.10194 
              63.2754 1.94025 56.7698 1.05124C51.7666 
              0.367541 46.6976 0.446843 41.7345 
              1.27873C39.2613 1.69328 37.813 
              4.19778 38.4501 6.62326C39.0873 
              9.04874 41.5694 10.4717 44.0505 
              10.1071C47.8511 9.54855 51.7191 
              9.52689 55.5402 10.0491C60.8642 
              10.7766 65.9928 12.5457 70.6331 
              15.2552C75.2735 17.9648 79.3347 
              21.5619 82.5849 25.841C84.9175 
              28.9121 86.7997 32.2913 88.1811 
              35.8758C89.083 38.2158 91.5421 
              39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
        </div>
      )}

      <SessionControls
        pageSize={pageSize}
        setPageSize={setPageSize}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        filterRange={filterRange}
        setFilterRange={setFilterRange}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        compact={compact}
        setCompact={setCompact}
      />

      <SessionList
        groupedSessions={groupedSessions}
        compact={compact}
        onEdit={onEdit}
        onDelete={handleDelete}
      />

      <PaginationControls
        count={count}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <DeleteSessionModal
        isOpen={confirmModalOpen}
        onCancel={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default SessionHistory;
