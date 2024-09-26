import React, { useState, useEffect } from 'react';
import { getTasks, addTask, updateTask, deleteTask, loginUser, getUsers, downloadTaskReport } from './api';
import './App.css';

const App = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('medium');  // New priority state
    const [tasks, setTasks] = useState([]);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [notification, setNotification] = useState('');
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [filterUser, setFilterUser] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));  // Check if token exists
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isLoggedIn) {
            fetchTasks();
            fetchUsers();
        }
    }, [filterUser, isLoggedIn]);

    const fetchTasks = async () => {
        try {
            const res = await getTasks(filterUser);
            setTasks(res.data);
        } catch (error) {
            setNotification('Error fetching tasks.');
        }
    };

    const handleDownloadReport = async () => {
        try {
            await downloadTaskReport();
        } catch (error) {
            console.error('Error downloading report:', error);
        }
    };

    // Fetch users
    const fetchUsers = async () => {
        try {
            const res = await getUsers();  // Fetch the users from the backend
            setUsers(res.data);  // Set users in state
        } catch (error) {
            setNotification('Error fetching users.');
        }
    };

    const handleLogin = async () => {
        try {
            const res = await loginUser({ email, password });
            const { token } = res.data;
            localStorage.setItem('token', token);
            setIsLoggedIn(true);
            setNotification('Logged in successfully.');
        } catch (error) {
            setNotification('Login failed. Please check your credentials.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');  // Clear token
        setIsLoggedIn(false);  // Set login status to false
        setNotification('Logged out successfully.');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description || !dueDate || !selectedUser || !priority) {
            alert('Please fill out all fields');
            return;
        }

        try {
            if (taskToEdit) {
                const res = await updateTask(taskToEdit._id, { title, description, dueDate, priority, userId: selectedUser });
                setTasks(tasks.map(task => task._id === res.data._id ? res.data : task));
                setTaskToEdit(null);
                setNotification('Task updated successfully.');
            } else {
                const res = await addTask({ title, description, dueDate, priority, userId: selectedUser });
                setTasks([...tasks, res.data]);
                setNotification('Task added successfully.');
            }

            setTitle('');
            setDescription('');
            setDueDate('');
            setPriority('medium');  // Reset priority after submission
            setSelectedUser('');
        } catch (error) {
            setNotification('Error adding/updating task.');
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await deleteTask(taskId);
            setTasks(tasks.filter(task => task._id !== taskId));
            setNotification('Task deleted successfully.');
        } catch (error) {
            setNotification('Error deleting task.');
        }
    };

    const handleEdit = (task) => {
        setTaskToEdit(task);
        setTitle(task.title);
        setDescription(task.description);
        setDueDate(task.dueDate);
        setPriority(task.priority);  // Set priority for editing
        setSelectedUser(task.user);
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        return task.status === filter;
    });

    const searchedTasks = filteredTasks.filter(task =>
        task.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isLoggedIn) {
        return (
            <div className="App">
                <h1>Remote Teams</h1>
                <h1>Login</h1>
                
                
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
                {notification && <div className="notification">{notification}</div>}
            </div>
        );
    }

    return (
        <div className="App">
            <h1>Remote Teams</h1>

            {/* Logout Button */}
            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>

            <div className="App">
            {/* Other task-related UI elements */}
            
            <button onClick={handleDownloadReport}>Download Task Report</button>
        </div>

            {notification && <div className="notification">{notification}</div>}

            <form onSubmit={handleSubmit}>
                <h2>{taskToEdit ? 'Edit Task' : 'Add Task'}</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="Due Date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
                <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    required
                >
                    <option value="">Select a User</option>
                    {users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.name}
                        </option>
                    ))}
                </select>

                {/* Priority Dropdown */}
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>

                <button type="submit">{taskToEdit ? 'Update Task' : 'Add Task'}</button>
            </form>

            <div className="task-filters">
                <input
                    type="text"
                    placeholder="Search by title"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
                <select
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                >
                    <option value="">All Users</option>
                    {users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>

            <h2>Tasks</h2>
            {searchedTasks.length > 0 ? (
                <ul className="task-list">
                    {searchedTasks.map((task) => {
                        const priorityColor = {
                            low: 'green',
                            medium: 'blue',
                            high: 'red'
                        };

                        return (
                            <li key={task._id} className="task-item" style={{ color: priorityColor[task.priority] }}>
                                <strong>{task.title}</strong> - {task.description} - {task.status} 
                                - Priority: <span>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                                - Due: {new Date(task.dueDate).toLocaleDateString()}
                                <div className="task-actions">
                                    <button onClick={() => handleEdit(task)}>Edit</button>
                                    <button className="delete-task" onClick={() => handleDelete(task._id)}>Delete</button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>No tasks available.</p>
            )}
        </div>
    );
};

export default App;