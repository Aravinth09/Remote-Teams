import React, { useState } from 'react';
import { loginUser } from './api';

const Login = ({ setUserId }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    

    const handleLogin = async () => {
        try {
            const res = await loginUser({ email, password });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            setUserId(user._id);
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
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
            {error && <p>{error}</p>}
        </div>
    );
};

export default Login;