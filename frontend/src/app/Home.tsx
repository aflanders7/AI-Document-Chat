"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">
        Document Chat
      </h1>

      <p className="mt-2 text-muted-foreground">
        Create a workspace and upload documents to start chatting.
      </p>

      <div className="mt-6 flex gap-4">
        <Button asChild>
          <Link href="/workspaces">
            View Workspaces
          </Link>
        </Button>
      </div>
    </main>
  );
}