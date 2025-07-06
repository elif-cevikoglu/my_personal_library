import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== rePassword) {
      toast.error('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      await API.post('/auth/users/', { username, password });

      const loginRes = await API.post('/auth/token/login/', {
        username,
        password,
      });

      localStorage.setItem('token', loginRes.data.auth_token);
      toast.success(`🎉 Welcome, ${username}!`);
      navigate('/books');
    } catch (err) {
      console.error(err);
      toast.error('Registration failed. Username may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          className="form-control mb-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="form-control mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="form-control mb-3"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
          disabled={loading}
          required
        />

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="mt-3">
        Already have an account? <a href="/">Log in</a>
      </p>
    </div>
  );
}

export default RegisterPage;
