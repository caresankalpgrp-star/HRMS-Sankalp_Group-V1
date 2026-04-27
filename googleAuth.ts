import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, MapPin, CheckCircle, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import supabase from '../lib/supabase';

const Attendance = () => {
  const [step, setStep] = useState<'select' | 'capture' | 'success'>('select');
  const [sites, setSites] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, eRes] = await Promise.all([
          fetch('/api/sites'),
          fetch('/api/employees')
        ]);
        setSites(await sRes.json());
        setEmployees(await eRes.json());

        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (user) {
          const empRes = await fetch(`/api/employees`);
          const allEmps = await empRes.json();
          const currentEmp = allEmps.find((e: any) => e.auth_user_id === user.id);
          if (currentEmp) setSelectedEmployee(currentEmp.id);
        }
      } catch (err) {
        setError("Failed to load initial data. Check your connection.");
      }
    };
    fetchData();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => setError("GPS is required for attendance. Please enable it.")
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setSelfie(imageSrc);
      setStep('capture');
    }
  };

  const handleSubmit = async (action: 'IN' | 'OUT') => {
    setError(null);
    if (!selectedSite || !selectedEmployee || !location || !selfie) {
      setError("Missing information. Please ensure GPS and Selfie are captured.");
      return;
    }

    setLoading(true);
    const attendanceData = {
      employee_id: selectedEmployee,
      site_id: selectedSite,
      action,
      geo_location: location,
      selfie_url: selfie,
    };

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to record attendance.");
      
      setStep('success');
    } catch (err: any) {
      setError(err.message || "Network error. Please ensure you are online.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-slate-900">Attendance Marked!</h2>
        <p className="text-slate-500 mb-8">Successfully recorded on the server.</p>
        <button 
          onClick={() => { setStep('select'); setSelfie(null); setError(null); }}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
        >
          Mark Another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
        <p className="text-slate-500">Real-time presence capture</p>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
          <AlertTriangle size={20} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Select Site</label>
          <select 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
          >
            <option value="">Choose a site...</option>
            {sites.map((site: any) => (
              <option key={site.id} value={site.id}>{site.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Employee</label>
          <select 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">Choose employee...</option>
            {employees.map((emp: any) => (
              <option key={emp.id} value={emp.id}>{emp.full_name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <MapPin size={16} className={location ? 'text-green-500' : 'text-slate-300'} />
          {location ? `GPS Fixed: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Waiting for GPS...'}
        </div>
      </div>

      {!selfie ? (
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-square shadow-xl group">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
            className="w-full h-full object-cover"
          />
          <button 
            onClick={handleCapture}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-slate-900 p-4 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"
          >
            <Camera size={28} />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden aspect-square shadow-xl border-4 border-white">
            <img src={selfie} alt="Selfie" className="w-full h-full object-cover" />
            <button 
              onClick={() => setSelfie(null)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <RefreshCw size={20} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleSubmit('IN')}
              disabled={loading}
              className="bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Punch IN'}
            </button>
            <button 
              onClick={() => handleSubmit('OUT')}
              disabled={loading}
              className="bg-orange-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Punch OUT'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
