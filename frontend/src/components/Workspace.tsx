"use client";

import { useState } from "react";
import { createWorkspace } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


export default function CreateWorkspace() {
  const [name, setName] = useState("");
  const { getToken } = useAuth();

  async function handleCreateWorkspace() {
    try {
      const token = await getToken();

      if (!token) {
        throw new Error("You must be logged in");
      }

      const workspace = await createWorkspace(name, token);

      console.log("Created:", workspace);
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

      <Button type="submit" onClick={handleCreateWorkspace}>
        Create Workspace
      </Button>
    </div>
  );
}