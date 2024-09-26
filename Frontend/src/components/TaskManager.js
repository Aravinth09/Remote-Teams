import React, { useState, useEffect } from 'react';
import TaskForm from '../components/Taskform';
import TaskList from '../components/Tasklist';
import { getTasks, updateTaskStatus, deleteTask } from './api';  // Import API functions

const TaskManager = ({ userId }) => {
    const [tasks, setTasks] = useState([]);
    const [notification, setNotification] = useState('');

    // Fetch tasks for the current user
    const fetchTasks = async () => {
        try {
            const res = await getTasks(userId);  // Use the getTasks API call
            setTasks(res);
            setNotification('');  // Clear notification on successful fetch
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setNotification('Error fetching tasks. Please try again later.');
        }
    };

    // Called when a task is added or edited
    const handleTaskSaved = () => {
        fetchTasks();  // Refresh task list
        setNotification('Task saved successfully.');
    };

    // Handle task status change (e.g., from 'in-progress' to 'completed')
    const handleTaskStatusChange = async (taskId, newStatus) => {
        try {
            await updateTaskStatus(taskId, newStatus);  // Use the updateTaskStatus API call
            fetchTasks();  // Refresh task list after status change
            setNotification('Task status updated successfully.');
        } catch (error) {
            console.error('Error updating task status:', error);
            setNotification('Error updating task status. Please try again.');
        }
    };

    // Handle task deletion
    const handleTaskDelete = async (taskId) => {
        try {
            await deleteTask(taskId);  // Use the deleteTask API call
            fetchTasks();  // Refresh task list after deletion
            setNotification('Task deleted successfully.');
        } catch (error) {
            console.error('Error deleting task:', error);
            setNotification('Error deleting task. Please try again.');
        }
    };

    // Fetch tasks when the component is mounted or when userId changes
    useEffect(() => {
        fetchTasks();
    }, [userId]);

    return (
        <div>
            {/* Display notifications */}
            {notification && <div className="notification">{notification}</div>}

            {/* Task Form to Add or Edit Tasks */}
            <TaskForm userId={userId} onTaskSaved={handleTaskSaved} />
            
            {/* Task List to Display and Manage Tasks */}
            <TaskList 
                tasks={tasks} 
                onTaskStatusChange={handleTaskStatusChange} 
                onTaskDelete={handleTaskDelete} 
            />
        </div>
    );
};

export default TaskManager;