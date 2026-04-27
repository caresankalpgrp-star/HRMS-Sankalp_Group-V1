import React, { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';

const Payroll = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [eRes, aRes, lRes] = await Promise.all([
        fetch('/api/employees'),
        fetch('/api/attendance'),
        fetch('/api/ledger')
      ]);
      setEmployees(await eRes.json());
      setAttendance(await aRes.json());
      setLedger(await lRes.json());
      setLoading(false);
    };
    fetchData();
  }, []);

  const calculatePayroll = (employee: any) => {
    const monthAtt = attendance.filter((a: any) => 
      a.employee_id === employee.id && 
      a.timestamp.startsWith(selectedMonth) &&
      a.action === 'IN'
    );
    
    const daysPresent = new Set(monthAtt.map((a: any) => a.timestamp.split('T')[0])).size;
    const basePay = employee.wage_type === 'daily' 
      ? daysPresent * employee.base_rate 
      : employee.base_rate;

    const monthLedger = ledger.filter((l: any) => 
      l.employee_id === employee.id && 
      l.date.startsWith(selectedMonth)
    );

    const advances = monthLedger.filter((l: any) => l.type === 'advance').reduce((a, b: any) => a + b.amount, 0);
    const deductions = monthLedger.filter((l: any) => l.type === 'deduction').reduce((a, b: any) => a + b.amount, 0);

    const netPay = basePay - advances + deductions;

    return {
      daysPresent,
      basePay,
      advances,
      deductions,
      netPay
    };
  };

  const generateSlip = (employee: any) => {
    const stats = calculatePayroll(employee);
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.text("Sankalp Interior Solution", 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text("ঘর নয়, স্বপ্ন সাজাই আমরা", 105, 26, { align: 'center' });
    
    doc.line(20, 35, 190, 35);
    
    doc.setFontSize(14);
    doc.text(`Salary Slip - ${selectedMonth}`, 20, 45);
    
    doc.setFontSize(12);
    doc.text(`Employee: ${employee.full_name}`, 20, 55);
    doc.text(`Role: ${employee.role}`, 20, 62);
    doc.text(`Phone: ${employee.phone}`, 20, 69);
    
    // Table
    doc.rect(20, 80, 170, 60);
    doc.line(20, 90, 190, 90);
    doc.text("Description", 25, 87);
    doc.text("Amount", 160, 87);
    
    doc.text("Basic Salary / Base Pay", 25, 100);
    doc.text(`INR ${stats.basePay.toLocaleString()}`, 160, 100);
    
    doc.text(`Attendance (${stats.daysPresent} days)`, 25, 110);
    doc.text("-", 160, 110);
    
    doc.text("Advances Taken", 25, 120);
    doc.text(`INR ${stats.advances.toLocaleString()}`, 160, 120);
    
    doc.text("Deductions / Recovery", 25, 130);
    doc.text(`INR ${stats.deductions.toLocaleString()}`, 160, 130);
    
    doc.line(20, 140, 190, 140);
    doc.setFont("helvetica", "bold");
    doc.text("Net Payable Amount", 25, 150);
    doc.text(`INR ${stats.netPay.toLocaleString()}`, 160, 150);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("This is a computer generated document.", 105, 280, { align: 'center' });
    
    doc.save(`Salary_Slip_${employee.full_name}_${selectedMonth}.pdf`);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Payroll Management</h1>
          <p className="text-slate-500">Calculate and generate salary slips</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
          <Calendar size={18} className="text-slate-400" />
          <input 
            type="month" 
            className="outline-none text-sm font-medium"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          />
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Days</th>
                <th className="px-6 py-4">Base Pay</th>
                <th className="px-6 py-4">Ledger Adj.</th>
                <th className="px-6 py-4">Net Pay</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp: any) => {
                const stats = calculatePayroll(emp);
                return (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{emp.full_name}</p>
                        <p className="text-xs text-slate-500 capitalize">{emp.wage_type} rate: ₹{emp.base_rate}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{stats.daysPresent}</td>
                    <td className="px-6 py-4">₹{stats.basePay.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs">
                        <p className="text-orange-600">Adv: -₹{stats.advances}</p>
                        <p className="text-green-600">Ded: +₹{stats.deductions}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-600">₹{stats.netPay.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => generateSlip(emp)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Download size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
