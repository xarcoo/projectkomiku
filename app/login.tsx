import * as React from "react";
import { Button, Card, Text } from "@rneui/base";
import { StyleSheet, View, TextInput } from "react-native";
import { AuthProvider, useAuth } from "./authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Login() {
  const { login } = useAuth();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const doLogin = async () => {
    const options = {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      body: "uid=" + username + "&upw=" + password,
    };
    const response = await fetch(
      "https://ubaya.xyz/react/160421050/login.php",
      options
    );
    const json = await response.json();

    if (json.result == "success") {
      try {
        await AsyncStorage.setItem("username", username);
        alert("Login successful");
        login();
      } catch (e) {
        console.error("Error saving data to AsyncStorage", e);
      }
    } else {
      alert("Username or password is incorrect");
    }
  };

  return (
    <Card>
      <Card.Title style={{ fontFamily: "verdana" }}>Silakan Login</Card.Title>
      <Card.Divider />
      <View style={styles.viewRow}>
        <Text style={{ fontFamily: "verdana" }}>Username </Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setUsername(text)}
          value={username}
        />
      </View>
      <View style={styles.viewRow}>
        <Text style={{ fontFamily: "verdana" }}>Password </Text>
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
      </View>
      <View style={styles.viewRow}>
        <Button
          style={styles.button}
          titleStyle={{ fontWeight: "bold" }}
          buttonStyle={{
            backgroundColor: "rgba(111, 202, 186, 1)",
            borderRadius: 3,
          }}
          title="Submit"
          onPress={() => {
            doLogin();
          }}
        />
      </View>
    </Card>
  );
}

export default Login;

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 200,
    borderWidth: 1,
    padding: 10,
    fontFamily: "verdana",
  },
  button: {
    height: 40,
    width: 200,
  },
  viewRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 50,
    margin: 3,
  },
});
