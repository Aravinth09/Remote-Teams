// src/components/TaskList.js
import React from 'react';

const TaskList = ({ tasks, onTaskStatusChange, onTaskDelete }) => {
    return (
        <div>
            <h2>Tasks</h2>
            {tasks.length > 0 ? (
                <ul>
                    {tasks.map((task) => {
                        const isOverdue = new Date(task.dueDate) < new Date();
                        const isNearDeadline = new Date(task.dueDate) - new Date() < 2 * 24 * 60 * 60 * 1000; // 2 days
                        
                        // Priority color mapping based on priority value
                        const priorityColor = {
                            low: 'green',
                            medium: 'blue',
                            high: 'red'
                        };

                        return (
                            <li key={task._id} style={{ color: isOverdue ? 'red' : isNearDeadline ? 'orange' : 'black' }}>
                                <strong>{task.title}</strong> - {task.description} - {task.status}
                                
                                {/* Display priority with color based on the value */}
                                <span style={{ color: priorityColor[task.priority] }}>
                                    - Priority: {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </span>
                                
                                {/* Display Due Date */}
                                - Due: {new Date(task.dueDate).toLocaleDateString()}

                                <button onClick={() => onTaskStatusChange(task._id, task.status === 'in-progress' ? 'completed' : 'in-progress')}>
                                    Mark as {task.status === 'in-progress' ? 'Completed' : 'In Progress'}
                                </button>
                                <button onClick={() => onTaskDelete(task._id)}>Delete</button>
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

export default TaskList;