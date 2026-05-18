import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from './useAuth';
import { api, setAuthToken } from '../services/api';

const avatarForRole = (role) => (
  role === 'admin'
    ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCz-RyG3IzGBfiRDTwR2jfVC_LwkoRQ2lw3fuqb-Ga1tQsaLFAc2ThFio0dhnToAnZY_4AbWpsMcCnX4oO3V_yBAX1Hikn54FY_9FBzv2q3PKdKtbyICEqOcMDBM6o4c7aNEIOrPgI8qbSji51RaBLgMzXcx2Od1jzMMGIRTUbtgCke2SQWfDec33JgErxnWPQQ_tugVSTZOK_2eaaQfuWq3f0ummnDNWtHUBNVHlmkDMDwb7hQWCVGegKCLg8dTmwahziSxIeeifk'
    : 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2YmQInxbNtNaX-H_iVWRlotsCcWbcUeje85YS7EKO3_cHws-GdlgOY41ire5kEP3KltTgmyGQceuA6-IDJg_hHFooZf9lWhOxhIGNm4i2dBlC0vnFn4MoxyIpExNwyVSVf_qY2D7XeBATv7O4rFHgqitqQTPf0chbrLo5MMTTsf184Aha4VKZMbbx1V_kJBdyZi46OT5JLuVfHxSRva2KSw-QT3D-IYkadQmwIqT5xTpilX1Tjq4yblc_fCB3o_bVcEeju8RUzyY'
);

const normalizeBackendUser = (backendUser, email, desiredRole = 'user') => {
  const role = desiredRole === 'admin' || email === 'admin@carbonlens.org' || email === 'curator@carbonlens.org'
    ? 'admin'
    : 'user';

  return {
    id: backendUser?.id || backendUser?._id || email,
    name: backendUser?.name || (role === 'admin' ? 'Elias Vance' : 'David Chen'),
    email,
    role,
    location: role === 'admin' ? 'Pacific NW Sector' : 'Coastal Habitat Station',
    tier: role === 'admin' ? 'Lead Analyst' : 'Soil Restorer',
    avatar: avatarForRole(role),
    ecoIndex: backendUser?.ecoScore || (role === 'admin' ? 985 : 420),
    liveBackend: true,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('carbonlens_auth');
    if (!saved) return null;

    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem('carbonlens_auth');
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('carbonlens_auth', JSON.stringify(user));
    } else {
      localStorage.removeItem('carbonlens_auth');
    }
  }, [user]);

  const buildMockUser = (email, desiredRole = 'user') => {
    // Standard mock verification
    return {
      id: email === 'admin@carbonlens.org' || desiredRole === 'admin' ? 'CL-0001-ADMIN' : 'CL-9912-USER',
      name: email === 'admin@carbonlens.org' || desiredRole === 'admin' ? 'Elias Vance' : 'David Chen',
      email: email,
      role: email === 'admin@carbonlens.org' || desiredRole === 'admin' ? 'admin' : 'user',
      location: email === 'admin@carbonlens.org' || desiredRole === 'admin' ? 'Pacific NW Sector' : 'Coastal Habitat Station',
      tier: email === 'admin@carbonlens.org' || desiredRole === 'admin' ? 'Lead Analyst' : 'Soil Restorer',
      avatar: avatarForRole(email === 'admin@carbonlens.org' || desiredRole === 'admin' ? 'admin' : 'user'),
      ecoIndex: email === 'admin@carbonlens.org' || desiredRole === 'admin' ? 985 : 420,
      liveBackend: false,
    };
  };

  const login = async (email, password, desiredRole = 'user') => {
    try {
      let response;
      try {
        response = await api.login({ email, password });
      } catch (loginErr) {
        if (!loginErr.message.toLowerCase().includes('not found')) throw loginErr;
        response = await api.register({
          name: desiredRole === 'admin' ? 'Elias Vance' : 'David Chen',
          email,
          password,
          department: desiredRole === 'admin' ? 'Administration' : 'Research',
        });
      }

      setAuthToken(response.token);
      const backendUser = normalizeBackendUser(response.user, email, desiredRole);
      setUser(backendUser);
      toast.success(`Welcome back, ${backendUser.name}! Live backend connected.`);
      return backendUser;
    } catch {
      setAuthToken(null);
      const mockUser = buildMockUser(email, desiredRole);
      setUser(mockUser);
      toast.success(`Welcome back, ${mockUser.name}! Running in local preview mode.`);
      return mockUser;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.register({
        name,
        email,
        password,
        department: 'Research',
      });

      setAuthToken(response.token);
      const backendUser = normalizeBackendUser(response.user, email, 'user');
      setUser(backendUser);
      toast.success(`Account registered! Live backend connected, ${name}!`);
      return backendUser;
    } catch {
      setAuthToken(null);
      const newUser = {
        id: 'CL-' + Math.floor(1000 + Math.random() * 9000) + '-NEW',
        name: name,
        email: email,
        role: 'user',
        location: 'Unassigned Base Station',
        tier: 'Novice Curator',
        avatar: avatarForRole('user'),
        ecoIndex: 100,
        liveBackend: false,
      };

      setUser(newUser);
      toast.success(`Account registered! Running in local preview mode, ${name}!`);
      return newUser;
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    toast.success('Successfully logged out from the ledger.');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
