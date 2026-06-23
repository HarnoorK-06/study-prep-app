// 1. imports 
import React from 'react';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import './SignupPage.css';
import * as api from '../services/api';

// 2. Create component
function SignupPage(props) {
    
    // 3. state: email, password, Name, error, loading
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [name , setName] = useState('');
    const [error , setError] = useState('');
    const [isLoading , setIsLoading] = useState(false);

    // 4. handles
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }
        
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleNameChange = (event) => {
        setName(event.target.value);
    }
        
    const handleSubmit = async (event) => {
    event.preventDefault();
        
    if (!email || !name || !password) {
        setError('all fields are required');
        return;
    }
    
    setIsLoading(true);
    try {
        const response = await api.signup(name, email, password);
        if (response.success) {
            props.onSignup(response.token);
        } else {
            setError(response.message);
        }
    } catch (error) {
        setError('Signup error , try again!');
    } finally {
        setIsLoading(false);
    }
};

    // 5. Return : form with Name , email , password inputs
    return (
        <div className = "signup-page">
            <div className = "signup-box">
                <h1>Signup</h1>
                 <form onSubmit = {handleSubmit}>
                    <input 
                    type = "text"
                    placeholder = "enter your name"
                    value = {name}
                    onChange = {handleNameChange}
                    />
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
                        {isLoading ? 'Signing up ...' : 'Signup'}
                    </button>
                </form>
                <p>Already have an account ? <Link to = "/login">Login</Link></p>
            </div>
        </div>
    );
}

// 6. export
export default SignupPage;

