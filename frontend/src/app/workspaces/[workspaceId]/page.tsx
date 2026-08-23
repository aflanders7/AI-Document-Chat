import FileUpload from "@/components/FileUpload";

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
    <main className="p-8">
      <h1 className="text-2xl font-bold">
        Workspace
      </h1>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">
          Upload Documents
        </h2>

        <div className="mt-4">
          <FileUpload workspaceId={workspaceId} />
        </div>
      </div>
    </main>
  );
}