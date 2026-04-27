import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Building2, Layers } from 'lucide-react';

const Sites = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sites')
      .then(res => res.json())
      .then(data => {
        setSites(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Project Sites</h1>
          <p className="text-slate-500">Manage ongoing interior projects</p>
        </div>
        <button className="bg-blue-600 text-white p-3 rounded-xl flex items-center gap-2 font-medium">
          <Plus size={20} />
          <span className="hidden sm:inline">New Site</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.map((site: any) => (
          <div key={site.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-32 bg-slate-900 flex items-center justify-center text-white relative">
               <Building2 size={48} className="opacity-20" />
               <div className="absolute bottom-4 left-4 right-4">
                 <h3 className="font-bold text-lg leading-tight">{site.name}</h3>
               </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-slate-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Location</p>
                  <p className="text-xs text-slate-500">Radius: {site.radius_meters}m</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Layers size={18} className="text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Status</p>
                  <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded uppercase">Active</span>
                </div>
              </div>
              <button className="w-full py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sites;
