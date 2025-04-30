import { ChangeEvent, ReactNode } from "react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputPayload {
  type: "text" | "url" | "email" | "password";
  name: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required: boolean;
  icon?: ReactNode;
}

export default function Input({ icon, ...props }: InputPayload) {
  return (
      <div className="relative">
        {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              {icon}
            </div>
        )}
        <ShadcnInput
            {...props}
            className={cn(
                "w-full rounded-md border-zinc-700 bg-zinc-700/50 p-3 text-white placeholder-zinc-400 focus:border-indigo-500 focus:bg-zinc-700 focus:ring-1 focus:ring-indigo-500",
                icon && "pl-10",
            )}
        />
      </div>
  );
}