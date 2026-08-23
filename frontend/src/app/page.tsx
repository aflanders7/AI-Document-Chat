"use client";

import { useAuth } from '@/context/AuthContext';
import AppHome from '@/app/Home';
import LandingPage from '@/app/LandingPage';

export default function Page() {
  const { user } = useAuth();

  return user ? <AppHome /> : <LandingPage />;
}
