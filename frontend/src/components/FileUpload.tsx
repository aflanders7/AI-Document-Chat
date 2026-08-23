"use client";

import { useState } from "react";
import { uploadDocument } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FileUploadProps = {
  workspaceId: string;
};

export default function FileUpload({
  workspaceId,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { getToken } = useAuth();

  async function handleUpload() {
    if (!file) return;

    setUploading(true);

    try {
      const token = await getToken();
      console.log(token);

      if (!token) {
        throw new Error("You must be logged in");
      }

      const document = await uploadDocument(
        file,
        workspaceId,
        token
      );

      console.log("Uploaded:", document);

      setFile(null);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="file"
        accept=".pdf,.txt,.md"
        onChange={(event) => {
          setFile(event.target.files?.[0] ?? null);
        }}
      />

      <Button
      className="w-fit"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}