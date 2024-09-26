// src/components/TaskForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskForm = ({ userId, taskToEdit, onTaskSaved }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('in-progress');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('medium'); // Field for priority
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description);
            setStatus(taskToEdit.status);
            setDueDate(taskToEdit.dueDate);
            setPriority(taskToEdit.priority);
        }

        const fetchUsers = async () => {
            try {
                const res = await axios.post('http://localhost:9000/api/users/user');
                setUsers(res.data);
            } catch (error) {
                console.error('Error fetching users.');
            }
        };

        fetchUsers();
    }, [taskToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const taskData = { title, description, status, userId, dueDate, priority };

        try {
            if (taskToEdit) {
                await axios.put(`http://localhost:9000/api/tasks/${taskToEdit._id}`, taskData);
            } else {
                await axios.post('http://localhost:9000/api/tasks', taskData);
            }
            onTaskSaved();
            setTitle('');
            setDescription('');
            setDueDate('');
            setPriority('medium');
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <h3>{taskToEdit ? 'Edit Task' : 'Add Task'}</h3>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="date" placeholder="Due Date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
        </select>

            {/* Priority Dropdown */}
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>

            <button type="submit">{taskToEdit ? 'Update Task' : 'Add Task'}</button>
        </form>
    );
};

export default TaskForm;