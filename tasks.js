// Using an in-memory or external database approach for serverless
let tasks = [
  { id: 1, title: 'Fix Navigation Header Bug', assignedTo: 'Subject 01', deadline: '2026-07-30', status: 'In Progress' },
  { id: 2, title: 'Setup Database Indexing', assignedTo: 'Subject 02', deadline: '2026-08-05', status: 'To Do' }
];

export default function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    return res.status(200).json({ tasks });
  } 
  
  if (method === 'POST') {
    const { title, assignedTo, deadline, status } = req.body;
    const newTask = {
      id: Date.now(),
      title,
      assignedTo,
      deadline,
      status: status || 'To Do'
    };
    tasks.push(newTask);
    return res.status(201).json(newTask);
  } 
  
  if (method === 'DELETE') {
    const { id } = req.query;
    tasks = tasks.filter(t => t.id != id);
    return res.status(200).json({ message: 'Deleted successfully' });
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}