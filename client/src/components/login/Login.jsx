import React, { useState } from 'react';
import './login.css';
import axios from 'axios';

// Login component that displays either the Login or Register screen
const Login = (loginProps) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isRegisterVisible, setisRegisterVisible] = useState(false);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    // sends a POST request to the server to register the user
    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        try {
            // Make a POST request to your server endpoint to add the login information
            const response = await axios.post('/api/register', { username, password });

            // Handle the response from the server
            if (response.status === 200) {
                console.log('Registration successful!');
                loginProps.onLogin(true); // Call the function passed from Main
                setErrorMsg('');
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.username);
            } else {
                console.log('Registration failed!');
                // Registration failed, handle the error
            }
        } catch (error) {
            console.log(error.response.data.error);
            setErrorMsg(error.response.data.error);
            // Handle any errors that occurred during the request
        }
    };

    // sends a POST request to the server to login the user
    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        try {
            // Make a POST request to your server endpoint to authenticate the login
            const response = await axios.post('/api/login', { username, password });

            // Handle the response from the server
            if (response.status === 200) {
                console.log('Login successful!');
                loginProps.onLogin(true); // Call the function passed from Main
                setErrorMsg('');
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.username);
            } else {
                console.log('Login failed!');
                // Login failed, handle the error
            }
        } catch (error) {
            //console.log(error);
            console.log(error.response.data.error);
            setErrorMsg(error.response.data.error);
        }
    };

    // toggles between the Login and Register screens
    const toggleLogin = () => {
        setisRegisterVisible(!isRegisterVisible);
    };

    return (
        <div>
            <div className="app">
                <div className="login-form">
                    <div className="login--title">Sign In</div>
                    <div id='login--container'>
                        <form onSubmit={isRegisterVisible ? handleRegisterSubmit : handleLoginSubmit}>
                            <div className="input-container">
                                <label>Username </label>
                                <input type="text" value={username} onChange={handleUsernameChange} />
                            </div>
                            <div className="input-container">
                                <label>Password </label>
                            <input type="password" value={password} onChange={handlePasswordChange} />
                            </div>
                            <div className="button-container">
                                <button className='submit-button' type="submit">{isRegisterVisible ? 'Register' : 'Login'}</button>
                            </div>
                            <br />
                            <div className="error">{errorMsg}</div>
                            <br />
                            Click here to <span className='clickable-span' onClick={toggleLogin}>{isRegisterVisible ? 'Login' : 'Register'}</span> instead
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;