import React, { useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

const SessionModal = ({ session, onClose, onSave }) => {
  const [form, setForm] = useState({ ...session });

    // Converts a datetime-local string (e.g., "2025-07-05T00:24") to a UTC ISO string
  const localToUTCISOString = (datetimeLocalStr) => {
    if (!datetimeLocalStr) return null;
    const [datePart, timePart] = datetimeLocalStr.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');

    const localDate = new Date(year, month - 1, day, hour, minute);
    return localDate.toISOString(); // Converts to correct UTC
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      form.start_time = localToUTCISOString(form.start_time);
      form.end_time = localToUTCISOString(form.end_time);
      const res = await API.put(`/api/reading-sessions/${form.id}/`, form);
      toast.success('📝 Session updated');
      onSave(res.data);
    } catch (err) {
      toast.error('Failed to update session');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Edit Session</h3>
        <label className="block text-sm font-medium">Start Time</label>
        <input type="datetime-local" name="start_time" value={form.start_time} onChange={handleChange} className="w-full border rounded px-3 py-2 mb-2" />
        <label className="block text-sm font-medium">End Time</label>
        <input type="datetime-local" name="end_time" value={form.end_time} onChange={handleChange} className="w-full border rounded px-3 py-2 mb-2" />
        <label className="block text-sm font-medium">Pages Read</label>
        <input type="number" name="pages_read" value={form.pages_read || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 mb-2" />
        <label className="block text-sm font-medium">Notes</label>
        <textarea name="notes" value={form.notes || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 mb-2" rows={3} />
        <div className="flex justify-between mt-4 justify-self-end">
          <div className="space-x-2">
            <button onClick={onClose} className="bg-red-600 cursor-pointer text-white px-4 py-1.5 rounded-md text-sm hover:bg-red-700">Cancel</button>
            <button onClick={handleSubmit} className="bg-indigo-600 cursor-pointer text-white px-4 py-1.5 rounded-md text-sm hover:bg-indigo-700">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionModal;
