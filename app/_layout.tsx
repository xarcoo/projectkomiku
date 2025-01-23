import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "./authContext";
import React, { useEffect } from "react";

function RootLayout() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    } else {
      router.replace("./drawer/");
    }
  }, [isLoggedIn]);
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{ title: "160421050 - 160421110", headerBackVisible: false }}
      />
      <Stack.Screen name="drawer" options={{ headerShown: false }} />
      <Stack.Screen name="bacakomik" options={{ title: "Baca Komik" }} />
      <Stack.Screen name="updatekomik" options={{ title: "Update Komik" }} />
      <Stack.Screen name="daftarkomik" options={{ title: "Daftar Komik" }} />
      <Stack.Screen
        name="register"
        options={{ title: "Registrasi Pengguna" }}
      />
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
