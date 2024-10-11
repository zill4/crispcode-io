import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Adjust the import path as needed
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { AuthContext } from '../contexts/authContext'; // Import AuthContext

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setCurrentUser } = useContext(AuthContext); // Get setCurrentUser from AuthContext

    // const handleEmailLogin = async (e) => {
    //     e.preventDefault();
    //     try {
    //         await signInWithEmailAndPassword(auth, email, password);
    //         navigate('/dashboard'); // Redirect to dashboard after successful login
    //     } catch (error) {
    //         setError(error.message);
    //     }
    // };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log(user);
            setCurrentUser(user); // Update the current user in AuthContext
            navigate('/dashboard'); // Redirect to dashboard after successful login
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="login-container">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="google-signin">
                <button onClick={handleGoogleLogin}>Sign in if your name is Justin</button>
                <p>yeah... this looks like shit, I'll fix it after I work on something more interesting</p>
            </div>
        </div>
    );
}

export default Login;