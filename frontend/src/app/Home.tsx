"use client";

import Link from "next/link";
import { ArrowRight, FolderOpen, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-full p-8">
      <div className="mx-auto max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Document Chat
            </h1>

            <p className="mt-2 text-muted-foreground">
              Upload your documents, organize them into workspaces,
              and ask questions about your files using AI.
            </p>
          </div>

          <div className="mt-8 pb-6">
            <Button asChild size="lg">
              <Link href="/workspaces">
                View Your Workspaces
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <FolderOpen className="h-8 w-8" />

              <h2 className="mt-4 text-xl font-semibold">
                Organize your documents
              </h2>

              <p className="mt-2 text-muted-foreground">
                Create workspaces to keep related documents
                together.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <MessageSquare className="h-8 w-8" />

              <h2 className="mt-4 text-xl font-semibold">
                Chat with your documents
              </h2>

              <p className="mt-2 text-muted-foreground">
                Ask questions and get answers based on the
                documents in your workspace.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}