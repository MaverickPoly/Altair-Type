"use client";

import Input from "@/components/Input";
import { ChangeEvent, FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.warning("Passwords do not match!");
      return;
    }

    const { success, message } = await register(
      formData.username,
      formData.email,
      formData.password
    );

    if (success) {
      toast.success(message);
      router.push("/auth/login");
    } else {
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 p-4">
      <Card className="w-full max-w-md border-zinc-700 bg-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            Create Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required={true}
              icon={<User className="h-5 w-5 text-zinc-400" />}
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required={true}
              icon={<Mail className="h-5 w-5 text-zinc-400" />}
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required={true}
              icon={<Lock className="h-5 w-5 text-zinc-400" />}
            />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required={true}
              icon={<Lock className="h-5 w-5 text-zinc-400" />}
            />
            <Button
              type="submit"
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
