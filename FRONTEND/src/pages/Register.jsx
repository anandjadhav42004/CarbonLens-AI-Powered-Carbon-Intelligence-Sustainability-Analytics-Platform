import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useForm } from 'react-hook-form';

const Register = () => {
  const { register: registerMock } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    registerMock(data.name, data.email, data.password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white text-on-surface font-inter flex flex-col lg:flex-row relative">
      <div className="grain-overlay"></div>

      {/* Left side: Ecological Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-container-low overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-b from-[#3e6247]/10 to-transparent pointer-events-none z-10"></div>
        
        <div className="relative z-20 flex items-center gap-3">
          <Link to="/" className="font-literata text-2xl font-bold text-primary italic">CarbonLens</Link>
          <span className="font-mono text-[9px] text-outline uppercase tracking-wider bg-white/80 border border-outline-variant px-2.5 py-0.5 rounded-full">v2.4</span>
        </div>

        <div className="relative z-20 max-w-lg mb-10 text-left">
          <h2 className="font-literata text-4xl md:text-5xl font-bold text-primary leading-tight mb-6">
            Begin your environmental monitoring journal.
          </h2>
          <p className="text-secondary text-sm leading-relaxed">
            Acquire an authenticated Eco Passport to secure your carbon data assets, submit certified sequestration metrics, and connect with global curators.
          </p>
        </div>

        <div className="relative z-20 rounded-2xl overflow-hidden aspect-[16/10] border border-outline-variant shadow-soft">
          <img 
            alt="Eco Field Journal" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5IT6UYShrp8i9U44TWkvgbXgrP5L_lbK3Pl1qrkJ7Kjw8DfpGqymUphYnu9Hi8fu3tYMJlxqROuJTxannJ1znqqHVX8pz5_ny530skQMFvkPxtOxXR8sfgPnHH1w9tCVGxpLpXlDwWfHoGqIP79DgSUJxq9Jem9VK6r5dkWwES-8qzLR-W2-DIOoKn3xlwfUgzJJdiiHFGByoB3FA9xghSlE7V4RhBo9aP-3068ZR0hUihb1_xHPEDc65b-vkGmd3e4oWSH0aSUs" 
          />
        </div>
      </div>

      {/* Right side: Register Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16">
        <div className="w-full max-w-md flex flex-col">
          <div className="text-center lg:text-left mb-10">
            <h1 className="font-literata text-3xl font-bold text-on-surface mb-2">Initialize Eco Passport</h1>
            <p className="text-secondary text-sm">Register a new verified curator station credentials.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-outline block mb-2">
                Curator Name
              </label>
              <input
                type="text"
                {...register('name', { required: 'Curator name is required' })}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl inset-shadow-input text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                placeholder="Dr. Evelyn Chase"
              />
              {errors.name && (
                <span className="text-red-700 text-xs mt-1 block">{errors.name.message}</span>
              )}
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-outline block mb-2">
                Station Email
              </label>
              <input
                type="email"
                {...register('email', { required: 'Email address is required' })}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl inset-shadow-input text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                placeholder="evelyn@carbonlens.org"
              />
              {errors.email && (
                <span className="text-red-700 text-xs mt-1 block">{errors.email.message}</span>
              )}
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-outline block mb-2">
                Secure Password
              </label>
              <input
                type="password"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl inset-shadow-input text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                placeholder="••••••••"
              />
              {errors.password && (
                <span className="text-red-700 text-xs mt-1 block">{errors.password.message}</span>
              )}
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                required
                className="rounded border-outline-variant text-primary focus:ring-primary focus:ring-opacity-25 mt-0.5"
              />
              <span className="text-xs text-secondary leading-normal">
                I certify that I am associated with a climate reserve or monitoring agency, and accept the field station terms of service.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-soft hover:shadow-lg active:scale-[0.98] transition-all text-sm text-center mt-2"
            >
              Request Eco Passport
            </button>
          </form>

          <div className="mt-8 text-center border-t border-outline-variant/30 pt-6">
            <p className="text-xs text-secondary">
              Already have credentials?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Access your Ledger
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
