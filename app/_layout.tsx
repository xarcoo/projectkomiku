import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "./authContext";
import React, { useEffect } from "react";

function RootLayout() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("./login");
    } else {
      router.replace("./drawer/");
    }
  }, [isLoggedIn]);
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="drawer" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}
