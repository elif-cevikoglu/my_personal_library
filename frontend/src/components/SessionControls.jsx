import React from 'react';

const SessionControls = ({
  pageSize, setPageSize,
  sortOrder, setSortOrder,
  filterRange, setFilterRange,
  groupBy, setGroupBy,
  compact, setCompact
}) => (
  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
    <label>
      Page Size:
      <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} className="ml-2 border px-2 py-1 rounded">
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>
    </label>
    <label>
      Sort:
      <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="ml-2 border px-2 py-1 rounded">
        <option value="desc">Newest first</option>
        <option value="asc">Oldest first</option>
      </select>
    </label>
    <label>
      Filter:
      <select value={filterRange} onChange={e => setFilterRange(e.target.value)} className="ml-2 border px-2 py-1 rounded">
        <option value="all">All time</option>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
      </select>
    </label>
    <label>
      Group by:
      <select value={groupBy} onChange={e => setGroupBy(e.target.value)} className="ml-2 border px-2 py-1 rounded">
        <option value="none">None</option>
        <option value="day">Day</option>
        <option value="week">Week</option>
      </select>
    </label>
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={compact} onChange={() => setCompact(!compact)} />
      Compact mode
    </label>
  </div>
);
export default SessionControls;
