import React from 'react';

const formatDuration = (start, end) => {
  if (!start || !end) return '—';
  const diff = Math.floor((new Date(end) - new Date(start)) / 1000);
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};


const SessionRow = ({ session, compact, onEdit, onDelete }) => {
  if (compact) {
    return (
      <tr key={session.id} className="border-t border-gray-200">
        <td className="px-2 py-1">{new Date(session.start_time).toLocaleString()}</td>
        <td className="px-2 py-1">{session.end_time ? new Date(session.end_time).toLocaleString() : '—'}</td>
        <td className="px-2 py-1">{formatDuration(session.start_time, session.end_time)}</td>
        <td className="px-2 py-1">{session.pages_read ?? '—'}</td>
        <td className="px-2 py-1 text-center">
          <button onClick={() => onEdit(session)} className="text-blue-600 cursor-pointer hover:text-indigo-700 hover:underline mr-2">Edit</button>
          <button onClick={() => onDelete(session.id)} className="text-red-600 cursor-pointer hover:text-red-700 hover:underline">Delete</button>
        </td>
      </tr>
    );
  }

  return (
    <div className="p-4 border rounded text-sm bg-gray-50 mb-2">
      <div className="text-gray-800">
        <strong>Start:</strong> {new Date(session.start_time).toLocaleString()}<br />
        <strong>End:</strong> {session.end_time ? new Date(session.end_time).toLocaleString() : 'Ongoing'}<br />
        <strong>Duration:</strong> {formatDuration(session.start_time, session.end_time)}<br />
        <strong>Pages:</strong> {session.pages_read ?? '—'}<br />
        {session.notes && <p className="mt-1"><strong>Notes:</strong> {session.notes}</p>}
      </div>
      <div className="mt-2 flex gap-4">
        <button onClick={() => onEdit(session)} 
            className="bg-indigo-600 cursor-pointer text-white px-4 py-1.5 rounded-md text-sm hover:bg-indigo-700"

        >Edit</button>
        <button onClick={() => onDelete(session.id)} 
            className="bg-red-600 cursor-pointer text-white px-4 py-1.5 rounded-md text-sm hover:bg-red-700"
        >Delete</button>
      </div>
    </div>
  );
};

export default SessionRow;