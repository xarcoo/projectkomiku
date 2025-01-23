import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider } from "../authContext";
import Index from "./index";
import Kategori from "./kategori";
import TambahKomik from "./tambahkomik";
import UpdateKomik from "../updatekomik";
import Logout from "./logout";
import HalamanCari from "./halamancari";
import KomikSaya from "./komiksaya";

const Drawer = createDrawerNavigator();

function DrawerLayout() {
  const [username, setUsername] = useState<string>("");

  const getUsername = async () => {
    try {
      const username = await AsyncStorage.getItem("username");
      if (username !== null) {
        setUsername(username);
      } else {
        setUsername("");
      }
    } catch (e) {
      console.error("Error reading username from AsyncStorage", e);
    }
  };

  useEffect(() => {
    getUsername();
  }, [username]);

  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="home"
        component={Index}
        options={{ drawerLabel: "Home", title: username }}
      />
      <Drawer.Screen
        name="Komik Saya"
        component={KomikSaya}
        options={{ drawerLabel: "Komik saya", title: "Komik Saya" }}
      />
      <Drawer.Screen
        name="halamancari"
        component={HalamanCari}
        options={{ drawerLabel: "Cari Komik", title: "Cari Komik" }}
      />
      <Drawer.Screen
        name="kategori"
        component={Kategori}
        options={{ drawerLabel: "Kategori", title: "Kategori Komik" }}
      />
      <Drawer.Screen
        name="tambahkomik"
        component={TambahKomik}
        options={{ drawerLabel: "Tambah Komik", title: "Tambah Komik" }}
      />
      <Drawer.Screen
        name="logout"
        component={Logout}
        options={{ drawerLabel: "Log Out", title: "Logout" }}
      />
    </Drawer.Navigator>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <DrawerLayout />
    </AuthProvider>
  );
}
