import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    presentToday: 0,
    totalEmployees: 0,
    activeSites: 0,
    pendingLedger: 0
  });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [attRes, empRes, siteRes, ledgerRes] = await Promise.all([
          fetch('/api/attendance'),
          fetch('/api/employees'),
          fetch('/api/sites'),
          fetch('/api/ledger')
        ]);

        const attendance = await attRes.json();
        const employees = await empRes.json();
        const sites = await siteRes.json();
        const ledger = await ledgerRes.json();

        // Calculate today's attendance
        const today = new Date().toISOString().split('T')[0];
        const presentToday = new Set(attendance.filter((a: any) => a.timestamp.startsWith(today)).map((a: any) => a.employee_id)).size;

        setStats({
          presentToday,
          totalEmployees: employees.length,
          activeSites: sites.length,
          pendingLedger: ledger.filter((l: any) => l.type === 'advance').reduce((acc: number, curr: any) => acc + curr.amount, 0)
        });

        setRecentAttendance(attendance.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="animate-pulse space-y-4">
    <div className="h-32 bg-slate-200 rounded-2xl"></div>
    <div className="grid grid-cols-2 gap-4">
      <div className="h-24 bg-slate-200 rounded-2xl"></div>
      <div className="h-24 bg-slate-200 rounded-2xl"></div>
    </div>
  </div>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
        <p className="text-slate-500">Sankalp Interior Solution Dashboard</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<CheckCircle2 className="text-green-500" />} 
          label="Present Today" 
          value={stats.presentToday} 
          subtext={`${stats.totalEmployees} Total Employees`}
        />
        <StatCard 
          icon={<MapPin className="text-blue-500" />} 
          label="Active Sites" 
          value={stats.activeSites} 
          subtext="Ongoing projects"
        />
        <StatCard 
          icon={<TrendingUp className="text-orange-500" />} 
          label="Total Advances" 
          value={`₹${stats.pendingLedger.toLocaleString()}`} 
          subtext="Pending recovery"
        />
        <StatCard 
          icon={<Clock className="text-purple-500" />} 
          label="Avg. Work Hours" 
          value="8.5h" 
          subtext="This week"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4">Recent Attendance</h2>
          <div className="space-y-4">
            {recentAttendance.map((log: any) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {log.employees?.full_name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{log.employees?.full_name}</p>
                    <p className="text-xs text-slate-500">{log.project_sites?.name} • {log.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4">Site Overview</h2>
          <div className="space-y-4">
            {/* Placeholder for site progress/stats */}
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">New Town Project</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">ON TRACK</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[75%]"></div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Salt Lake Office</span>
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">DELAYED</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-orange-600 h-full w-[40%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, subtext }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <span className="text-sm font-medium text-slate-500">{label}</span>
    </div>
    <div className="text-2xl font-bold text-slate-900">{value}</div>
    <div className="text-xs text-slate-400 mt-1">{subtext}</div>
  </div>
);

export default Dashboard;
