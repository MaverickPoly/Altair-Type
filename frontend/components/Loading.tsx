import { motion } from "framer-motion";

export default function Loading() {
  return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 sm:p-6">
        <motion.div
            className="flex flex-col items-center gap-4"
            role="status"
            aria-label="Loading"
        >
          {/* Spinner */}
          <motion.div
              className="h-12 w-12 rounded-full border-4 border-indigo-400 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          {/* Text */}
          <motion.p
              className="text-sm font-medium text-zinc-400"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          >
            Loading...
          </motion.p>
        </motion.div>
      </div>
  );
}