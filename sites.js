import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('attendance_logs')
        .select(`
          *,
          employees (full_name),
          project_sites (name)
        `)
        .order('timestamp', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { employee_id, site_id, action, geo_location, selfie_url } = req.body;
      
      // Basic validation
      if (!employee_id || !site_id || !action || !geo_location || !selfie_url) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { data, error } = await supabase
        .from('attendance_logs')
        .insert({
          employee_id,
          site_id,
          action,
          geo_location,
          selfie_url,
          timestamp: new Date().toISOString(),
          status: 'verified'
        })
        .select()
        .single();
      
      if (error) throw error;
      return res.status(201).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
