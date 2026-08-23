import FileUpload from "@/components/FileUpload";
import ChatInterface from "@/components/ChatInterface";

type WorkspacePageProps = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export default async function WorkspacePage({
  params,
}: WorkspacePageProps) {
  const { workspaceId } = await params;

  return (
    <main className="min-h-full p-8">
      <div className="mx-auto max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">
            Workspace
          </h1>

          <p className="mt-2 text-muted-foreground">
            Upload documents and ask questions about your files.
          </p>
        </div>

        <div className="mt-8 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">
            Documents
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Upload PDF, TXT, or Markdown files to this workspace.
          </p>

          <div className="mt-6">
            <FileUpload workspaceId={workspaceId} />
          </div>
        </div>

        <div className="mt-8 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">
            Chat
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Ask questions about the documents in this workspace.
          </p>

          <div className="mt-6">
            <ChatInterface workspaceId={workspaceId} />
          </div>
        </div>
      </div>
    </main>
  );
}