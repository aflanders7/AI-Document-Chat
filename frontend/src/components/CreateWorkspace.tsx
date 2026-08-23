"use client";

import { useState } from "react";
import { createWorkspace } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from "next/navigation";


export default function CreateWorkspace() {
  const [name, setName] = useState("");
  const { getToken } = useAuth();
  const router = useRouter();

  async function handleCreateWorkspace() {
    try {
      const token = await getToken();
      console.log(token);
      if (!token) {
        throw new Error("You must be logged in");
      }

      const workspace = await createWorkspace(name, token);
      router.push(`/workspaces/${workspace.id}`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col gap-4">

      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Workspace name"
        type="text"
      />

      <Button className="w-fit" onClick={handleCreateWorkspace}>
        Create Workspace
      </Button>
    </div>
  );
}