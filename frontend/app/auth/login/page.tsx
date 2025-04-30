"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import Input from "@/components/Input";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { login, user } = useAuth();
  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { success, message } = await login(
      formData.username,
      formData.password
    );

    if (success) {
      toast.success(message);
      router.push(`/`);
    } else {
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 p-4">
      <Card className="w-full max-w-md border-zinc-700 bg-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            Welcome Back
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
            <Button
              type="submit"
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
