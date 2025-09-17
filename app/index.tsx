import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/auth" />;
  }
  return <Redirect href="/journal" />;
}
