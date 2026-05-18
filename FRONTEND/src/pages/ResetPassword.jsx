import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.resetPassword({ token, password });
      toast.success('Password reset complete.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-on-surface font-inter flex items-center justify-center p-8">
      <form onSubmit={submit} className="w-full max-w-md border border-outline-variant rounded-3xl p-8 shadow-soft">
        <h1 className="font-literata text-3xl font-bold text-primary mb-2">Create New Password</h1>
        <p className="text-secondary text-sm mb-6">Choose a fresh credential for your CarbonLens account.</p>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={6} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none" placeholder="New password" />
        <button disabled={loading} className="w-full mt-5 py-3 bg-primary text-white rounded-xl font-bold">{loading ? 'Saving...' : 'Reset Password'}</button>
      </form>
    </div>
  );
};

export default ResetPassword;
