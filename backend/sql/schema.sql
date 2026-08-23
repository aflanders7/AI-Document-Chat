-- Enable pgvector
create extension if not exists vector;


-- ============================================
-- WORKSPACES
-- ============================================

create table public.workspaces (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    created_at timestamptz not null default now()
);


-- ============================================
-- WORKSPACE MEMBERS
-- ============================================

create table public.workspace_members (
    workspace_id uuid not null references public.workspaces(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    role text not null default 'member',
    created_at timestamptz not null default now(),

    primary key (workspace_id, user_id),

    constraint workspace_member_role_check
        check (role in ('owner', 'member'))
);


-- ============================================
-- DOCUMENTS
-- ============================================

create table public.documents (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references public.workspaces(id) on delete cascade,

    filename text not null,
    storage_path text not null,
    mime_type text,
    file_size bigint,

    status text not null default 'uploaded',

    created_at timestamptz not null default now(),

    constraint document_status_check
        check (status in ('uploaded', 'processing', 'indexed', 'failed'))
);


-- ============================================
-- DOCUMENT CHUNKS
-- ============================================

create table public.document_chunks (
    id uuid primary key default gen_random_uuid(),
    document_id uuid not null references public.documents(id) on delete cascade,

    chunk_index integer not null,
    content text not null,

    -- OpenAI text-embedding-3-small uses 1536 dimensions
    embedding vector(1536),

    metadata jsonb,

    created_at timestamptz not null default now(),

    unique (document_id, chunk_index)
);


-- ============================================
-- CONVERSATIONS
-- ============================================

create table public.conversations (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references public.workspaces(id) on delete cascade,

    title text not null default 'New conversation',

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


-- ============================================
-- MESSAGES
-- ============================================

create table public.messages (
    id uuid primary key default gen_random_uuid(),
    conversation_id uuid not null references public.conversations(id) on delete cascade,

    role text not null,
    content text not null,

    created_at timestamptz not null default now(),

    constraint message_role_check
        check (role in ('system', 'user', 'assistant', 'tool'))
);

-- add indexes
create index documents_workspace_id_idx
    on public.documents(workspace_id);

create index document_chunks_document_id_idx
    on public.document_chunks(document_id);

create index conversations_workspace_id_idx
    on public.conversations(workspace_id);

create index messages_conversation_id_idx
    on public.messages(conversation_id);