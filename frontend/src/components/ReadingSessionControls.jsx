import React, { useState, useEffect, useRef } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

const ReadingSessionControls = ({ bookId, onSessionAdded }) => {
  const containerRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);
  const [pagesRead, setPagesRead] = useState('');
  const [notes, setNotes] = useState('');
  const [manual, setManual] = useState(false);
  const [manualStart, setManualStart] = useState('');
  const [manualEnd, setManualEnd] = useState('');
  const [timerType, setTimerType] = useState('stopwatch');
  const [elapsed, setElapsed] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [customMinutes, setCustomMinutes] = useState('');
  const [intervalId, setIntervalId] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [styleProps, setStyleProps] = useState({});

  useEffect(() => {
    if (!sessionId) return;
    const tick = () => {
      setElapsed((prev) => prev + 1);
      if (timerType === 'countdown') {
        setCountdown((prev) => {
          if (prev <= 1) {
            toast.info('⏰ Countdown complete!');
            clearInterval(intervalId);
            return 0;
          }
          return prev - 1;
        });
      }
    };
    const id = setInterval(tick, 1000);
    setIntervalId(id);
    return () => clearInterval(id);
  }, [sessionId]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getBoundingStyles = () => {
    const rect = containerRef.current.getBoundingClientRect();
    return {
      position: 'fixed',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      zIndex: 50,
      transition: 'all 0.5s ease-in-out',
    };
  };

  const expandToFullscreen = () => {
    const initial = getBoundingStyles();
    setStyleProps(initial);
    setAnimating(true);
    requestAnimationFrame(() => {
      setStyleProps({
        top: '0px',
        left: '0px',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        zIndex: 50,
        padding: '1.5rem',
        overflow: 'auto',
        backgroundColor: 'white',
        transition: 'all 0.5s ease-in-out'
      });
    });
  };

  const collapseFromFullscreen = () => {
    setTimeout(() => {
      setAnimating(false);
      setStyleProps({});
    }, 250);

    setStyleProps(prev => ({
      ...prev,
      opacity: 0,
      transition: 'opacity 0.3s ease-in-out'
    }));
  };

  const startSession = async () => {
    try {
      const res = await API.post('/api/reading-sessions/start/', { book: bookId });
      setSessionId(res.data.id);
      setElapsed(0);
      expandToFullscreen();
      if (timerType === 'countdown' && !countdown) {
        toast.error('Set countdown time first.');
        return;
      }
      toast.success('📖 Reading session started');
    } catch (err) {
      toast.error('Failed to start session');
    }
  };

  const endSession = async () => {
    if (!sessionId) return toast.error('No active session');
    try {
      const res = await API.post(`/api/reading-sessions/${sessionId}/end/`, {
        pages_read: pagesRead,
        notes
      });
      toast.success('✅ Session saved');
      setSessionId(null);
      setPagesRead('');
      setNotes('');
      setElapsed(0);
      setCountdown(0);
      clearInterval(intervalId);
      collapseFromFullscreen();
      onSessionAdded?.(res.data);
    } catch (err) {
      toast.error('Failed to end session');
    }
  };

  const cancelSession = async () => {
    await API.delete(`/api/reading-sessions/${sessionId}/`);
    onSessionAdded?.();
    setSessionId(null);
    setPagesRead('');
    setNotes('');
    setElapsed(0);
    setCountdown(0);
    clearInterval(intervalId);
    collapseFromFullscreen();
    toast.info('Session cancelled');
  };

  // Converts a datetime-local string (e.g., "2025-07-05T00:24") to a UTC ISO string
  const localToUTCISOString = (datetimeLocalStr) => {
    if (!datetimeLocalStr) return null;
    const [datePart, timePart] = datetimeLocalStr.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');

    const localDate = new Date(year, month - 1, day, hour, minute);
    return localDate.toISOString(); // Converts to correct UTC
  };


  const submitManualSession = async () => {
    try {
      const res = await API.post('/api/reading-sessions/', {
        book: bookId,
        start_time: localToUTCISOString(manualStart),
        end_time: localToUTCISOString(manualEnd),
        pages_read: pagesRead,
        notes
      });
      toast.success('📝 Manual session added');
      setPagesRead('');
      setNotes('');
      setManualStart('');
      setManualEnd('');
      setManual(false);
      collapseFromFullscreen();
      onSessionAdded?.(res.data);
    } catch (err) {
      toast.error('Failed to add manual session');
    }
  };

  const handleCountdownPreset = (minutes) => {
    setCountdown(minutes * 60);
    setTimerType('countdown');
  };

  const handleCustomCountdown = () => {
    const mins = parseInt(customMinutes, 10);
    if (!mins || mins <= 0) return toast.error('Enter valid minutes');
    setCountdown(mins * 60);
    setTimerType('countdown');
  };

  return (
    <div
      ref={containerRef}
      style={animating ? styleProps : {}}
      className={`transition-all ease-in-out ${
        animating ? '' : 'p-4 border rounded bg-white shadow'
      }`}
    >
      <h2 className="text-xl font-semibold mb-2">Reading Session</h2>

      {!sessionId && (
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium text-gray-700">Timer Type:</label>
          <div className="flex flex-wrap gap-2 items-center">
            <button onClick={() => setTimerType('stopwatch')} className={`px-3 py-1 rounded ${timerType === 'stopwatch' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              Stopwatch
            </button>
            <button onClick={() => handleCountdownPreset(5)} className="px-3 py-1 rounded bg-gray-100">5 min</button>
            <button onClick={() => handleCountdownPreset(10)} className="px-3 py-1 rounded bg-gray-100">10 min</button>
            <button onClick={() => handleCountdownPreset(20)} className="px-3 py-1 rounded bg-gray-100">20 min</button>
            <input
              type="number"
              placeholder="Custom min"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              className="border px-2 py-1 rounded w-20"
            />
            <button onClick={handleCustomCountdown} className="px-2 py-1 bg-purple-500 text-white rounded">Set</button>
          </div>
        </div>
      )}

      {!sessionId && (
        <div className="space-y-2">
          <button
            onClick={startSession}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Start Reading Session
          </button>
          <button
            onClick={() => setManual(!manual)}
            className="ml-4 text-sm text-gray-600 underline"
          >
            {manual ? 'Cancel Manual Entry' : 'Add Manually'}
          </button>
        </div>
      )}

      {sessionId && (
        <div className="space-y-2">
          <p className="text-green-600">Session active.</p>
          <div className="text-sm font-mono">
            ⏱ {timerType === 'stopwatch' ? formatTime(elapsed) : formatTime(countdown)}
          </div>
          <input
            type="number"
            placeholder="Pages read"
            value={pagesRead}
            onChange={(e) => setPagesRead(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            rows={3}
          />
          <div className="flex gap-4">
            <button
              onClick={cancelSession}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={endSession}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              End Session
            </button>
          </div>
        </div>
      )}

      {manual && (
        <div className="mt-4 space-y-2">
          <input
            type="datetime-local"
            value={manualStart}
            onChange={(e) => setManualStart(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            placeholder="Start Time"
          />
          <input
            type="datetime-local"
            value={manualEnd}
            onChange={(e) => setManualEnd(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            placeholder="End Time"
          />
          <input
            type="number"
            placeholder="Pages read"
            value={pagesRead}
            onChange={(e) => setPagesRead(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            rows={3}
          />
          <button
            onClick={submitManualSession}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Save Manual Session
          </button>
        </div>
      )}
    </div>
  );
};

export default ReadingSessionControls;
