import { fetchWithAuth } from "./fetchWithAuth";

export async function fetchCurrentUser(token: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/me`;

  return fetchWithAuth(url, token);
}

export async function createWorkspace(name: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/workspaces`;

  return fetchWithAuth(url, token, {method: 'POST',
    body: JSON.stringify({ name: name }),
  });
}