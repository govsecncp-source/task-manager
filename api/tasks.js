let tasks = [
    {
        id: 1,
        title: "Fix Navigation Header Bug",
        description: "Header collapses incorrectly on mobile viewports.",
        assignee: "Subject 01",
        assigneeKey: "user1",
        deadline: "2026-07-30",
        status: "In Progress",
        attachments: [],
        comments: []
    }
];

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        return res.status(200).json({ tasks });
    }

    if (req.method === 'POST') {
        try {
            const { id, title, description, assignee, assigneeKey, deadline, status, attachments, comments } = req.body;
            
            const existingIndex = tasks.findIndex(t => t.id === id);

            if (existingIndex !== -1) {
                tasks[existingIndex] = {
                    id: tasks[existingIndex].id,
                    title: title || tasks[existingIndex].title,
                    description: description || tasks[existingIndex].description,
                    assignee: assignee || tasks[existingIndex].assignee,
                    assigneeKey: assigneeKey || tasks[existingIndex].assigneeKey,
                    deadline: deadline || tasks[existingIndex].deadline,
                    status: status || tasks[existingIndex].status,
                    attachments: attachments || tasks[existingIndex].attachments,
                    comments: comments || tasks[existingIndex].comments
                };
                return res.status(200).json({ message: 'Task updated successfully', task: tasks[existingIndex] });
            }

            const newTask = {
                id: Date.now(),
                title: title || 'Untitled Task',
                description: description || '',
                assignee: assignee || 'Unassigned',
                assigneeKey: assigneeKey || '',
                deadline: deadline || '',
                status: status || 'To Do',
                attachments: attachments || [],
                comments: comments || []
            };

            tasks.push(newTask);
            return res.status(201).json({ message: 'Task created successfully', task: newTask });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    if (req.method === 'DELETE') {
        const taskId = parseInt(req.query.id);
        tasks = tasks.filter(t => t.id !== taskId);
        return res.status(200).json({ message: 'Task deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
