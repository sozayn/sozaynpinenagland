
import React, { useState } from 'react';
import * as userService from '../services/userService';
import type { UserProfile } from '../types';

interface AuthProps {
  onLoginSuccess: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email) {
      setError('Please enter an email address.');
      return;
    }
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(res => setTimeout(res, 500));
    
    const user = userService.login(email.toLowerCase());
    if (user) {
      userService.createSession(user.email);
      onLoginSuccess(user);
    } else {
      setError('No account found with that email. Please sign up first.');
    }
    setIsLoading(false);
  };

  const handleSignup = async () => {
    if (!email) {
      setError('Please enter an email address to create an account.');
      return;
    }
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(res => setTimeout(res, 500));

    const existingUser = userService.login(email.toLowerCase());
    if (existingUser) {
        setError('An account with this email already exists. Please log in.');
        setIsLoading(false);
        return;
    }

    const newUser = userService.signup(email.toLowerCase());
    if (newUser) {
      userService.createSession(newUser.email);
      onLoginSuccess(newUser);
    } else {
      setError('An unexpected error occurred during sign up.');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-light dark:bg-brand-dark">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-brand-dark-secondary">
        <div className="text-center">
            <img src="https://drive.google.com/uc?export=view&id=1kx-FEkNXVDXS_ZVw9nI2cJU2ZiHCfRU1" alt="Pinenagland Logo" className="w-20 h-20 mx-auto" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-brand-light">Welcome to Pinenagland</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in or create an account to continue your journey.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4 rounded-md shadow-sm">
                 <div>
                    <label htmlFor="email-address" className="sr-only">Email address</label>
                    <input id="email-address" name="email" type="email" autoComplete="email" required
                           className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-brand-accent focus:border-brand-accent focus:z-10 sm:text-sm dark:bg-brand-dark-tertiary dark:border-brand-dark-tertiary dark:text-white"
                           placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input id="password" name="password" type="password" autoComplete="current-password"
                           className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-brand-accent focus:border-brand-accent focus:z-10 sm:text-sm dark:bg-brand-dark-tertiary dark:border-brand-dark-tertiary dark:text-white"
                           placeholder="Password (for demonstration)" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
            </div>
            {error && <p className="text-sm text-center text-red-500">{error}</p>}
            <div className="flex flex-col gap-4 sm:flex-row">
                <button type="button" onClick={handleLogin} disabled={isLoading}
                        className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md group bg-brand-accent hover:bg-brand-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-50">
                    {isLoading ? 'Logging In...' : 'Log In'}
                </button>
                <button type="button" onClick={handleSignup} disabled={isLoading}
                        className="relative flex justify-center w-full px-4 py-2 text-sm font-medium border rounded-md text-brand-accent border-brand-accent hover:bg-brand-accent/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-50 dark:text-brand-light dark:border-brand-accent/50 dark:hover:bg-brand-accent/20">
                    {isLoading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
