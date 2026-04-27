import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Camera, 
  Wallet, 
  Users, 
  MapPin, 
  FileText,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import supabase from './lib/supabase';
import { handleGoogleRedirect, signInWithGoogle } from './lib/googleAuth';

// Pages
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Ledger from './pages/Ledger';
import Payroll from './pages/Payroll';
import Sites from './pages/Sites';
import Employees from './pages/Employees';

// App Initialization
handleGoogleRedirect();

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 pb-20 md:pb-0 md:pl-64">
        {/* Desktop Sidebar */}
        <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white p-6">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-blue-400">Sankalp</h1>
            <p className="text-xs text-slate-400 mt-1">ঘর নয়, স্বপ্ন সাজাই আমরা</p>
          </div>
          
          <div className="flex-1 space-y-2">
            <NavLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavLink to="/attendance" icon={<Camera size={20} />} label="Attendance" />
            <NavLink to="/ledger" icon={<Wallet size={20} />} label="Khata/Ledger" />
            <NavLink to="/payroll" icon={<FileText size={20} />} label="Payroll" />
            <NavLink to="/sites" icon={<MapPin size={20} />} label="Project Sites" />
            <NavLink to="/employees" icon={<Users size={20} />} label="Employees" />
          </div>

          <button 
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-3 p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors mt-auto"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </nav>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50">
          <MobileNavLink to="/" icon={<LayoutDashboard size={24} />} />
          <MobileNavLink to="/attendance" icon={<Camera size={24} />} />
          <div className="relative -top-6">
             <Link to="/attendance" className="bg-blue-600 text-white p-4 rounded-full shadow-lg block border-4 border-slate-50">
               <Camera size={28} />
             </Link>
          </div>
          <MobileNavLink to="/ledger" icon={<Wallet size={24} />} />
          <button onClick={() => setIsMenuOpen(true)} className="text-slate-400">
            <Menu size={24} />
          </button>
        </nav>

        {/* Mobile Sidebar Menu (Overlay) */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/50 z-[60]"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="fixed right-0 top-0 bottom-0 w-64 bg-slate-900 text-white p-6 z-[70] shadow-xl"
              >
                <div className="flex justify-between items-center mb-10">
                  <h1 className="text-xl font-bold">Menu</h1>
                  <button onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
                </div>
                <div className="space-y-4">
                  <NavLink to="/payroll" icon={<FileText size={20} />} label="Payroll" onClick={() => setIsMenuOpen(false)} />
                  <NavLink to="/sites" icon={<MapPin size={20} />} label="Project Sites" onClick={() => setIsMenuOpen(false)} />
                  <NavLink to="/employees" icon={<Users size={20} />} label="Employees" onClick={() => setIsMenuOpen(false)} />
                  <button 
                    onClick={() => supabase.auth.signOut()}
                    className="flex items-center gap-3 p-3 text-slate-400 w-full text-left"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/ledger" element={<Ledger />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/sites" element={<Sites />} />
            <Route path="/employees" element={<Employees />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const NavLink = ({ to, icon, label, onClick }: any) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
        isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const MobileNavLink = ({ to, icon }: any) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
      {icon}
    </Link>
  );
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Sankalp</h1>
          <p className="text-slate-500 mt-2">Interior Solution HRMS</p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 text-sm font-medium"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500">Or continue with</span></div>
        </div>

        <button 
          onClick={() => signInWithGoogle('Sankalp HRMS')}
          className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <span className="font-medium text-slate-700">Google</span>
        </button>
      </div>
    </div>
  );
};

export default App;
