import { AuthProvider } from "@/contexts/AuthContext";
import { useDeepLinking } from "@/hooks/useDeepLinking";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  useDeepLinking();

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
