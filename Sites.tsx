import React, { useState, useEffect } from 'react';
import { Plus, Search, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const Ledger = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newEntry, setNewEntry] = useState({
    employee_id: '',
    type: 'advance',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/ledger');
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await fetch('/api/employees');
        const empData = await empRes.json();
        setEmployees(Array.isArray(empData) ? empData : []);
        await fetchEntries();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/ledger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry)
    });
    if (res.ok) {
      setShowAdd(false);
      fetchEntries();
      setNewEntry({
        employee_id: '',
        type: 'advance',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const filteredEntries = entries.filter((entry: any) => 
    entry.employees?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAdvance = entries.filter((e: any) => e.type === 'advance').reduce((a, b: any) => a + (Number(b.amount) || 0), 0);
  const totalDeduction = entries.filter((e: any) => e.type === 'deduction').reduce((a, b: any) => a + (Number(b.amount) || 0), 0);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading ledger...</div>;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Khata / Ledger</h1>
          <p className="text-slate-500">Track advances and deductions</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white p-3 rounded-xl flex items-center gap-2 font-medium"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Add Entry</span>
        </button>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase mb-1">Total Advance</p>
          <p className="text-xl font-bold text-orange-600">₹{totalAdvance.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase mb-1">Total Recovery</p>
          <p className="text-xl font-bold text-green-600">₹{totalDeduction.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search employee or reason..." 
            className="flex-1 outline-none text-sm" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntries.map((entry: any) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{entry.employees?.full_name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                      entry.type === 'advance' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {entry.type === 'advance' ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                      {entry.type.toUpperCase()}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-bold ${entry.type === 'advance' ? 'text-slate-900' : 'text-green-600'}`}>
                    ₹{Number(entry.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{entry.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add Ledger Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employee</label>
                <select 
                  required
                  className="w-full px-4 py-2 rounded-xl border border-slate-200"
                  value={newEntry.employee_id}
                  onChange={e => setNewEntry({...newEntry, employee_id: e.target.value})}
                >
                  <option value="">Select Employee</option>
                  {employees.map((e: any) => <option key={e.id} value={e.id}>{e.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <div className="flex gap-4">
                  <label className="flex-1">
                    <input 
                      type="radio" 
                      name="type" 
                      value="advance" 
                      checked={newEntry.type === 'advance'}
                      onChange={e => setNewEntry({...newEntry, type: e.target.value})}
                      className="hidden peer"
                    />
                    <div className="text-center py-2 rounded-xl border border-slate-200 peer-checked:bg-orange-50 peer-checked:border-orange-200 peer-checked:text-orange-600 cursor-pointer">Advance</div>
                  </label>
                  <label className="flex-1">
                    <input 
                      type="radio" 
                      name="type" 
                      value="deduction" 
                      checked={newEntry.type === 'deduction'}
                      onChange={e => setNewEntry({...newEntry, type: e.target.value})}
                      className="hidden peer"
                    />
                    <div className="text-center py-2 rounded-xl border border-slate-200 peer-checked:bg-green-50 peer-checked:border-green-200 peer-checked:text-green-600 cursor-pointer">Deduction</div>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹)</label>
                <input 
                  type="number" 
                  required
                  className="w-full px-4 py-2 rounded-xl border border-slate-200"
                  value={newEntry.amount}
                  onChange={e => setNewEntry({...newEntry, amount: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 rounded-xl border border-slate-200"
                  value={newEntry.description}
                  onChange={e => setNewEntry({...newEntry, description: e.target.value})}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-2 text-slate-500 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ledger;
