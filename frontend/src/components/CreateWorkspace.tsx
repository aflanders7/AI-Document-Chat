"use client";

import { useState } from "react";
import { createWorkspace } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import router from "next/router";


export default function CreateWorkspace() {
  const [name, setName] = useState("");
  const { getToken } = useAuth();

  async function handleCreateWorkspace() {
    console.log("here");
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
    <div>

      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Workspace name"
        type="text"
      />

      <Button onClick={handleCreateWorkspace}>
        Create Workspace
      </Button>
    </div>
  );
}