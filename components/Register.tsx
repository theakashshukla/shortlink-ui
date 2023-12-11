"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../utils/api";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';

export function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registeredUser, setRegisteredUser] = useState(null);

  const handleRegister = async () => {
    try {
      // Make a register API request
      const response = await api.post("/v1/auth/register", {
        name,
        email,
        password,
      });
      const { authToken } = response.data;

      // Redirect to the dashboard page
      setRegisteredUser(response.data.user.name);
      setTimeout(() => {
        router.push("/login");
      }, 4000);
    } catch (error) {
      console.error("Registration error:", error);
      // Handle registration error (show error message, etc.)
    }
  };

  return (
    <div>
      {registeredUser ? (
        <div>
          <h2>Thank You, {registeredUser}!</h2>
          <p>Your registration was successful.</p>
          <p>You can now log in using your credentials.</p>
        </div>
      ) : (
        <div>
          <h2>Register</h2>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleRegister}>Register</Button>
        </div>
      )}
    </div>
  );
}
