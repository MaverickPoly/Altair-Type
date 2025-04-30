import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null && !loading) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (loading) return <Loading />;

  return children;
}
