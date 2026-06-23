// 1. Imports
import React from 'react';
import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './LoginPage.css';
import * as api from '../services/api';

// 2. create loginpage component
function LoginPage(props) {
    const navigate = useNavigate();
    
    // 3. create state variables
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [error , setError] = useState('');
    const [isLoading , setIsLoading] = useState(false);

    // 4. create handle functions
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }
    
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }
    
    const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!email || !password) {
        setError('both fields are required');
        return;
    }
    
    setIsLoading(true);
    try {
        const response = await api.login(email, password);
        if (response.success) {
            props.onLogin(response.token);
        } else {
            setError(response.message);
        }
    } catch (error) {
        setError('Login error , try again!');
    } finally {
        setIsLoading(false);
    }
};

    // 5. return form
    return (
        <div className = "login-page">
            <div className = "login-box">
                <h1>Login</h1>
                 <form onSubmit = {handleSubmit}>
                    <input 
                    type = "email"
                    placeholder = "enter your email"
                    value = {email}
                    onChange = {handleEmailChange}
                    />
                    <input 
                    type = "password"
                    placeholder = "enter your password"
                    value = {password}
                    onChange = {handlePasswordChange}
                    />

                    {error && <p className = "error">{error}</p>}

                    <button type ="submit" disabled = {isLoading}>
                        {isLoading ? 'Loggin In ...' : 'Login'}
                    </button>
                </form>
                <p>Don't have an account ? <Link to = "/signup">Sign up</Link></p>
            </div>
        </div>
    );
}

// 6. export 
export default LoginPage;

