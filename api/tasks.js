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
    },
    {
        id: 2,
        title: "Setup Database Indexing",
        description: "Optimize query speeds for the main records table.",
        assignee: "Subject 02",
        assigneeKey: "user2",
        deadline: "2026-08-05",
        status: "To Do",
        attachments: [],
        comments: []
    }
];

export default function handler(req, res) {
    // Enable CORS
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
        const { id, title, description, assignee, assigneeKey, deadline, status, attachments, comments } = req.body;
        
        // Check if task already exists (Update instead of Duplicate)
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

        // Otherwise, create a new task
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
    }

    if (req.method === 'DELETE') {
        const taskId = parseInt(req.query.id);
        tasks = tasks.filter(t => t.id !== taskId);
        return res.status(200).json({ message: 'Task deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
