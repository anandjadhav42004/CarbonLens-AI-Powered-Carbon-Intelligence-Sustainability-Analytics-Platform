import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from './useAuth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('carbonlens_auth');
    if (saved) return JSON.parse(saved);
    // Default mock user matching our elite bio-curator Dr. Aris Thorne
    return {
      id: 'CL-8829-THORNE',
      name: 'Dr. Aris Thorne',
      email: 'curator@carbonlens.org',
      role: 'admin',
      location: 'Amazon Basin Reserve IV',
      tier: 'Apex Restorationist',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAddBDSnyKnzhYahgwnfatZ7VdfRC_UIXC-nI_W0BIZU2TleAP5l24hSPBVRhEomyyjrkoxX8Jh1JbvUNkm3-u25x2X2qwNK7FYVaEzhUm1J2ABEUucA5xLclzjOLbPrmmMFF9AVniCj4t5cDEBywYQUar8aR01kJngHztCNQSteT4bsY9_zMImAA4N03Kqm_lobbhQfQ5hbvrOR0V33uHL4iDHC3LHW_Jz4jfa5fGOMbUdpr_o8sLrHFX6aJxLyTZVt6B-li2xZJ0',
      ecoIndex: 942
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('carbonlens_auth', JSON.stringify(user));
    } else {
      localStorage.removeItem('carbonlens_auth');
    }
  }, [user]);

  const login = (email, password, desiredRole = 'user') => {
    void password;
    // Standard mock verification
    const mockUser = {
      id: email === 'admin@carbonlens.org' || desiredRole === 'admin' ? 'CL-0001-ADMIN' : 'CL-9912-USER',
      name: email === 'admin@carbonlens.org' || desiredRole === 'admin' ? 'Elias Vance' : 'David Chen',
      email: email,
      role: email === 'admin@carbonlens.org' || desiredRole === 'admin' ? 'admin' : 'user',
      location: email === 'admin@carbonlens.org' || desiredRole === 'admin' ? 'Pacific NW Sector' : 'Coastal Habitat Station',
      tier: email === 'admin@carbonlens.org' || desiredRole === 'admin' ? 'Lead Analyst' : 'Soil Restorer',
      avatar: email === 'admin@carbonlens.org' || desiredRole === 'admin' 
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCz-RyG3IzGBfiRDTwR2jfVC_LwkoRQ2lw3fuqb-Ga1tQsaLFAc2ThFio0dhnToAnZY_4AbWpsMcCnX4oO3V_yBAX1Hikn54FY_9FBzv2q3PKdKtbyICEqOcMDBM6o4c7aNEIOrPgI8qbSji51RaBLgMzXcx2Od1jzMMGIRTUbtgCke2SQWfDec33JgErxnWPQQ_tugVSTZOK_2eaaQfuWq3f0ummnDNWtHUBNVHlmkDMDwb7hQWCVGegKCLg8dTmwahziSxIeeifk'
        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2YmQInxbNtNaX-H_iVWRlotsCcWbcUeje85YS7EKO3_cHws-GdlgOY41ire5kEP3KltTgmyGQceuA6-IDJg_hHFooZf9lWhOxhIGNm4i2dBlC0vnFn4MoxyIpExNwyVSVf_qY2D7XeBATv7O4rFHgqitqQTPf0chbrLo5MMTTsf184Aha4VKZMbbx1V_kJBdyZi46OT5JLuVfHxSRva2KSw-QT3D-IYkadQmwIqT5xTpilX1Tjq4yblc_fCB3o_bVcEeju8RUzyY',
      ecoIndex: email === 'admin@carbonlens.org' || desiredRole === 'admin' ? 985 : 420
    };
    
    setUser(mockUser);
    toast.success(`Welcome back, ${mockUser.name}!`);
    return mockUser;
  };

  const register = (name, email, password) => {
    void password;
    const newUser = {
      id: 'CL-' + Math.floor(1000 + Math.random() * 9000) + '-NEW',
      name: name,
      email: email,
      role: 'user',
      location: 'Unassigned Base Station',
      tier: 'Novice Curator',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2YmQInxbNtNaX-H_iVWRlotsCcWbcUeje85YS7EKO3_cHws-GdlgOY41ire5kEP3KltTgmyGQceuA6-IDJg_hHFooZf9lWhOxhIGNm4i2dBlC0vnFn4MoxyIpExNwyVSVf_qY2D7XeBATv7O4rFHgqitqQTPf0chbrLo5MMTTsf184Aha4VKZMbbx1V_kJBdyZi46OT5JLuVfHxSRva2KSw-QT3D-IYkadQmwIqT5xTpilX1Tjq4yblc_fCB3o_bVcEeju8RUzyY',
      ecoIndex: 100
    };
    
    setUser(newUser);
    toast.success(`Account registered! Welcome to the ledger, ${name}!`);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    toast.success('Successfully logged out from the ledger.');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
