"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CreateWorkspace from "@/components/CreateWorkspace";
import { getWorkspaces } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

type Workspace = {
  id: string;
  name: string;
};

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  function handleSelectWorkspace(workspaceId: string) {
    router.push(`/workspaces/${workspaceId}`);
  }

  return (
    <main className="p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Your Workspaces
          </h1>

          <div className="mt-6">
            {loading ? (
              <p>Loading workspaces...</p>
            ) : workspaces.length === 0 ? (
              <p className="text-muted-foreground">
                You don't have any workspaces yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {workspaces.map((workspace) => (
                  <Button
                    key={workspace.id}
                    variant="outline"
                    onClick={() =>
                      handleSelectWorkspace(workspace.id)
                    }
                  >
                    {workspace.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-md">
          <h2 className="text-xl font-bold">
            Create Workspace
          </h2>

          <div className="mt-4">
            <CreateWorkspace />
          </div>
        </div>
      </div>
    </main>
  );
}