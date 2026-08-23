"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Folder, Plus, X, Loader2 } from "lucide-react";

import CreateWorkspace from "@/components/CreateWorkspace";
import { getWorkspaces } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Workspace = {
  id: string;
  name: string;
};

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function loadWorkspaces() {
      try {
        const token = await getToken();

        if (!token) {
          throw new Error("You must be logged in");
        }

        const data = await getWorkspaces(token);

        setWorkspaces(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadWorkspaces();
  }, [getToken]);

  return (
    <main className="min-h-full p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Your Workspaces
            </h1>

            <p className="mt-2 text-muted-foreground">
              Select a workspace to view your documents and chat.
            </p>
          </div>

          <Button
            onClick={() => setShowCreate(!showCreate)}
          >
            {showCreate ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                New Workspace
              </>
            )}
          </Button>
        </div>

        {/* Create workspace */}
        {showCreate && (
          <Card className="mt-6">
            <CardContent className="p-6">
              <h2 className="font-semibold">
                Create a new workspace
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Give your workspace a name to get started.
              </p>

              <div className="mt-4 max-w-md">
                <CreateWorkspace />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Workspace list */}
        <div className="mt-8">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading workspaces...
            </div>
          ) : workspaces.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-16 text-center">
                <Folder className="h-10 w-10 text-muted-foreground" />

                <h2 className="mt-4 text-lg font-semibold">
                  No workspaces yet
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Create a workspace to start uploading documents.
                </p>

                <Button
                  className="mt-5"
                  onClick={() => setShowCreate(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Workspace
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workspaces.map((workspace) => (
                <Card
                  key={workspace.id}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() =>
                    router.push(
                      `/workspaces/${workspace.id}`
                    )
                  }
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-muted p-2">
                        <Folder className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate font-semibold">
                          {workspace.name}
                        </h2>

                        <p className="text-sm text-muted-foreground">
                          Open workspace
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}