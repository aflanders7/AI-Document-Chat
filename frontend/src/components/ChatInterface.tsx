"use client";

import { useState } from "react";
import { chatWithWorkspace } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChatInterfaceProps = {
  workspaceId: string;
};

export default function ChatInterface({
  workspaceId,
}: ChatInterfaceProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  async function handleSubmit() {
    if (!question.trim() || loading) return;

    setLoading(true);
    setAnswer("");

    try {
      const token = await getToken();

      if (!token) {
        throw new Error("You must be logged in");
      }

      const response = await chatWithWorkspace(
        workspaceId,
        question,
        token
      );

      setAnswer(response.answer);
      setQuestion("");
    } catch (error) {
      console.error(error);
      setAnswer("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      {answer && (
        <div className="rounded-lg border p-4">
          <p className="whitespace-pre-wrap">
            {answer}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your documents..."
          disabled={loading}
        />

        <Button
          onClick={handleSubmit}
          disabled={!question.trim() || loading}
        >
          {loading ? "Thinking..." : "Send"}
        </Button>
      </div>
    </div>
  );
}