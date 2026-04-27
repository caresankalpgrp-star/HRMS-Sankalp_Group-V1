import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { employee_id } = req.query;
      let query = supabase.from('financial_ledger').select('*, employees(full_name)');
      if (employee_id) query = query.eq('employee_id', employee_id);
      
      const { data, error } = await query.order('date', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { employee_id, type, amount, description, date } = req.body;
      
      if (!employee_id || !type || !amount) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { data, error } = await supabase
        .from('financial_ledger')
        .insert({ 
          employee_id, 
          type, 
          amount: parseFloat(amount), 
          description, 
          date: date || new Date().toISOString() 
        })
        .select()
        .single();
      
      if (error) throw error;
      return res.status(201).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
