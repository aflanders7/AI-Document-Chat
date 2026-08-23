"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getWorkspaces } from "@/utils/api";
import { useRouter, usePathname } from "next/navigation";
import {
  PanelRightOpen,
  PanelRightClose,
  CirclePlus,
  Folder,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

type Workspace = {
  id: string;
  name: string;
};

const Sidebar: React.FC = () => {
  const { user, getToken } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(true);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const workspaceId = pathname.startsWith("/workspaces/")
    ? pathname.split("/")[2]
    : null;

  useEffect(() => {
    if (!user) return;

    async function loadWorkspaces() {
      try {
        setLoading(true);
        setError(null);

        const token = await getToken();

        if (!token) {
          throw new Error("You must be logged in");
        }

        const data = await getWorkspaces(token);

        setWorkspaces(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load workspaces.");
      } finally {
        setLoading(false);
      }
    }

    loadWorkspaces();
  }, [user, getToken]);

  if (!user) return null;

  return (
    <div
      className={cn(
        "flex h-full fixed lg:relative z-40 lg:z-auto top-0 left-0 lg:h-auto",
        isOpen && "border-r border-neutral-100 dark:border-neutral-900"
      )}
    >
      {!isOpen ? (
        <div className="flex items-start">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            className="ml-2 mt-4"
          >
            <PanelRightClose className="w-6 h-6" />
          </Button>
        </div>
      ) : (
        <Card
          className={cn(
            "border-0 h-full flex flex-col transition-all duration-300",
            isOpen ? "w-72 p-4" : "w-0"
          )}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
            >
              <h2 className="text-lg font-bold pl-2">
                AI Document Chat
              </h2>
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <PanelRightOpen className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex flex-col h-[calc(100vh-72px)]">
            {/* New workspace */}
            <Button
              variant="outline"
              className="flex justify-start space-x-2 items-center w-full"
              onClick={() => router.push("/workspaces")}
            >
              <CirclePlus className="mr-2" />
              <span>New Workspace</span>
            </Button>

            <Separator className="my-4" />

            {/* Workspaces */}
            <div className="flex flex-col gap-1 overflow-y-auto">
              <h3 className="px-2 mb-2 text-sm font-medium text-muted-foreground">
                Workspaces
              </h3>

              {loading && (
                <div className="flex items-center gap-2 px-2 py-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </div>
              )}

              {error && !loading && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />

                  <AlertTitle>Error</AlertTitle>

                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {!loading &&
                !error &&
                workspaces.length === 0 && (
                  <p className="px-2 py-3 text-sm text-muted-foreground">
                    No workspaces yet.
                  </p>
                )}

              {!loading &&
                !error &&
                workspaces.map((workspace) => (
                  <Button
                    key={workspace.id}
                    variant={
                      workspace.id === workspaceId
                        ? "secondary"
                        : "ghost"
                    }
                    className="w-full justify-start"
                    onClick={() =>
                      router.push(
                        `/workspaces/${workspace.id}`
                      )
                    }
                  >
                    <Folder className="mr-2 h-4 w-4" />

                    <span className="truncate">
                      {workspace.name}
                    </span>
                  </Button>
                ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Sidebar;