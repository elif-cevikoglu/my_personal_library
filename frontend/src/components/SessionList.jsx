import React from 'react';
import SessionRow from './SessionRow';

const SessionList = ({ groupedSessions, compact, onEdit, onDelete }) => (
  <>
    {Object.entries(groupedSessions).map(([label, items]) => (
      <div key={label}>
        {label && <h3 className="font-semibold mt-4 mb-2 text-gray-700">{label}</h3>}
        {compact ? (
          <table className="w-full text-xs border border-gray-200 rounded shadow-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-2 py-1">Start</th>
                <th className="px-2 py-1">End</th>
                <th className="px-2 py-1">Duration</th>
                <th className="px-2 py-1">Pages</th>
                <th className="px-2 py-1 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <SessionRow key={s.id} session={s} compact onEdit={onEdit} onDelete={onDelete} />
              ))}
            </tbody>
          </table>
        ) : (
          items.map((s) => (
            <SessionRow key={s.id} session={s} compact={false} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>
    ))}
  </>
);

export default SessionList;
