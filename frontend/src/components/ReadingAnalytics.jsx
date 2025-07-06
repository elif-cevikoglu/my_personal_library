import React, { useEffect, useState } from 'react';
import API from '../api';
import dayjs from 'dayjs';
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  ScatterChart, Scatter,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#0088FE'];

const ReadingAnalytics = ({ bookId }) => {
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('duration');

  useEffect(() => {
    API.get('/api/reading-sessions/').then(res => {
      const filtered = (res.data.results || res.data).filter(s => s.book === Number(bookId));
      setSessions(filtered);
    });
  }, [bookId]);

  const sessionsByDay = sessions.reduce((acc, s) => {
    const date = dayjs(s.start_time).format('YYYY-MM-DD');
    acc[date] = acc[date] || { date, pages: 0, duration: 0 };
    acc[date].pages += s.pages_read || 0;
    acc[date].duration += dayjs(s.end_time).diff(dayjs(s.start_time), 'minute');
    return acc;
  }, {});

  const dayData = Object.values(sessionsByDay);

  const scatterData = sessions.map(s => ({
    duration: dayjs(s.end_time).diff(dayjs(s.start_time), 'minute'),
    pages: s.pages_read || 0
  }));

  const radarData = sessions.map((s, i) => ({
    session: `S${i + 1}`,
    duration: dayjs(s.end_time).diff(dayjs(s.start_time), 'minute'),
    pages: s.pages_read || 0,
    notesLength: s.notes?.length || 0
  })).slice(0, 10);

  const pieData = sessions.reduce((acc, s) => {
    const key = s.book_title || `Book ${s.book}`;
    const entry = acc.find(d => d.name === key);
    const duration = dayjs(s.end_time).diff(dayjs(s.start_time), 'minute');
    if (entry) entry.value += duration;
    else acc.push({ name: key, value: duration });
    return acc;
  }, []);

  const tabs = [
    { id: 'duration', label: '📈 Duration Over Time' },
    { id: 'pages', label: '📊 Pages Read' },
    { id: 'scatter', label: '🧮 Duration vs Pages' },
    { id: 'radar', label: '🧭 Session Quality' },
    { id: 'pie', label: '📦 Time per Book' }
  ];

  return (
    <div className="mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">📚 Reading Analytics</h2>

      <div className="flex gap-4 mb-6 border-b">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-2 px-2 border-b-2 transition-all ${activeTab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ width: '100%', height: 300 }}>
        {activeTab === 'duration' && (
          <ResponsiveContainer>
            <LineChart data={dayData}>
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'minutes', angle: -90, position: 'insideLeft' }} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Line type="monotone" dataKey="duration" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'pages' && (
          <ResponsiveContainer>
            <BarChart data={dayData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pages" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'scatter' && (
          <ResponsiveContainer>
            <ScatterChart>
              <CartesianGrid />
              <XAxis dataKey="duration" name="Duration (min)" />
              <YAxis dataKey="pages" name="Pages Read" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={scatterData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'radar' && (
          <ResponsiveContainer>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="session" />
              <PolarRadiusAxis />
              <Radar name="Quality" dataKey="notesLength" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'pie' && (
          <ResponsiveContainer>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ReadingAnalytics;
