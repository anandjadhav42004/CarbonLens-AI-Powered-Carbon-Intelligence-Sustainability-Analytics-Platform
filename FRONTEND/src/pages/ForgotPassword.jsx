import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await api.forgotPassword({ email });
      setResetUrl(res.resetUrl);
      toast.success('Reset link generated for MVP demo.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-on-surface font-inter flex items-center justify-center p-8">
      <form onSubmit={submit} className="w-full max-w-md border border-outline-variant rounded-3xl p-8 shadow-soft">
        <Link to="/" className="font-literata text-2xl font-bold text-primary italic">CarbonLens</Link>
        <h1 className="font-literata text-3xl font-bold mt-8 mb-2">Reset Password</h1>
        <p className="text-secondary text-sm mb-6">Enter your email to generate a secure reset link.</p>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none" placeholder="curator@carbonlens.org" />
        <button disabled={loading} className="w-full mt-5 py-3 bg-primary text-white rounded-xl font-bold">{loading ? 'Generating...' : 'Generate Reset Link'}</button>
        {resetUrl && <Link className="block mt-5 text-primary text-sm font-bold break-all" to={resetUrl}>Open demo reset link: {resetUrl}</Link>}
      </form>
    </div>
  );
};

export default ForgotPassword;
