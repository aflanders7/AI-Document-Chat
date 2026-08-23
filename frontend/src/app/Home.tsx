"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <main>
      <h1>AI Document Chat</h1>
      <p>Successfully logged in</p>
      <p>{message}</p>
    </main>
  );
}