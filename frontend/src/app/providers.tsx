"use client";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();
  const pathname = usePathname();

  const shouldShowSidebarAndNavbar = !(pathname === "/" && !user);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
      </div>
    );
  }

  return (
      <div className="flex flex-grow h-screen">
        {shouldShowSidebarAndNavbar && <Sidebar />}

        <main className="flex flex-grow flex-col max-w-full">
          {shouldShowSidebarAndNavbar && <Navbar />}

          <div
            className={cn(
              shouldShowSidebarAndNavbar
                ? "min-h-[calc(100vh-72px)]"
                : "min-h-[100vh]"
            )}
          >
            {children}
          </div>
        </main>
      </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
        <div className="flex flex-col min-h-screen bg-background">
          <LayoutContent>{children}</LayoutContent>
        </div>
    </AuthProvider>
  );
}