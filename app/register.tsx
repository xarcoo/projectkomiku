import * as React from "react";
import { Button, Card, Text } from "@rneui/base";
import { StyleSheet, View, TextInput } from "react-native";
import { router } from "expo-router";

function Register() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const doRegister = async () => {
    const options = {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      body: "un=" + username + "&upw=" + password,
    };
    const response = await fetch(
      "https://ubaya.xyz/react/160421050/uas/register.php",
      options
    );
    const json = await response.json();

    if (json.result == "success") {
      alert("Berhasil registrasi pengguna baru. Silahkan melakukan login");
      router.replace("/login");
    } else {
      alert(json.message);
    }
  };

  return (
    <Card
      containerStyle={{
        borderRadius: 10,
      }}
    >
      <Card.Title style={{ fontFamily: "verdana" }}>
        Registrasi Pengguna
      </Card.Title>
      <Card.Divider />
      <View style={styles.viewRow}>
        <Text
          style={{
            fontFamily: "verdana",
            textAlign: "left",
            width: 200,
            marginBottom: 8,
          }}
        >
          Username{" "}
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setUsername(text)}
          value={username}
        />
      </View>
      <View style={styles.viewRow}>
        <Text
          style={{
            fontFamily: "verdana",
            textAlign: "left",
            width: 200,
            marginBottom: 8,
          }}
        >
          Password{" "}
        </Text>
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
            borderRadius: 8,
          }}
          title="Submit"
          onPress={() => {
            doRegister();
          }}
        />
      </View>
    </Card>
  );
}

export default Register;

const styles = StyleSheet.create({
  cardStyle: {
    height: 100,
  },
  input: {
    height: 40,
    width: 200,
    borderWidth: 1,
    padding: 10,
    fontFamily: "verdana",
    borderRadius: 8,
  },
  button: {
    width: 200,
  },
  viewRow: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
});
