import React from 'react';
import { useHistory } from 'react-router-dom';

const Profile = () => {
    const history = useHistory();

    const handleLogout = () => {
        // Add logic to log out the user
        console.log('User logged out');
        // Redirect to login page or home after logout
        history.push('/login');
    };

    const handleDeleteAccount = () => {
        // Add logic to delete the user's account
        console.log('Account deleted');
        // Redirect to a confirmation page or home after deletion
        history.push('/goodbye');
    };

    return (
        <div>
            <h1>User Profile</h1>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleDeleteAccount}>Delete Account</button>
        </div>
    );
};

export default Profile;