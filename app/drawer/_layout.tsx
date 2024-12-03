import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider } from "../authContext";
import Index from "./index";
import Logout from "./logout";

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
