"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Login () {
    const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Make a login API request
      const response = await api.post('/v1/auth/login', { email, password });
      const { authToken } = response.data;

      // Save the token to localStorage (you may want to use a more secure method)
      localStorage.setItem('authToken', authToken);
      console.log('authToken', authToken);
      // Redirect to the dashboard page
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error (show error message, etc.)
    }
  };


  return (
    <div>
      <h2>Login</h2>
      <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
};

