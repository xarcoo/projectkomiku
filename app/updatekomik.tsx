import React, { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  Text,
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import RNPickerSelect from "react-native-picker-select";
import { Button } from "@rneui/base";

export default function UpdateKomik() {
  const [title, setTitle] = useState("");
  const [releasedate, setReleasedate] = useState("");
  const [description, setDesc] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState(null);
  const [scenes, setScenes] = useState(null);

  const [categoryOption, setCategoryOption] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [komik, setKomik] = useState({
    judul: "",
    deskripsi: "",
    tanggal_rilis: "",
    pengarang: "",
    kategori: null,
    konten: null,
  });
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const refRBSheet = useRef();
  const [imageUri, setImageUri] = useState("");
  const [id, setId] = useState("1");
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.id) {
      setId(params.id.toString());
      console.log(id);
    }
  }, [params.id]);

  useEffect(() => {
    const fetchKomik = async () => {
      try {
        const options = {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/x-www-form-urlencoded",
          }),
          body: "id=" + id,
        };
        const response = await fetch(
          "https://ubaya.xyz/react/160421050/uas/detailkomik.php",
          options
        );
        const json = await response.json();

        if (json.result === "success") {
          setKomik(json.data);
        } else {
          alert("Failed to load comic details");
        }
        console.log(komik);
      } catch (error) {
        console.error("Error fetching comic details:", error);
      }

      try {
        const options = {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/x-www-form-urlencoded",
          }),
          body: "id=" + id,
        };
        const response = await fetch(
          "https://ubaya.xyz/react/160421050/uas/pilihankategori.php",
          options
        );
        const json = await response.json();
        setCategoryOption(json.data);
      } catch (error) {
        console.error("Error fetching category option:", error);
      }
    };

    if (id) {
      fetchKomik();
    }
  }, [id, triggerRefresh]);

  useEffect(() => {
    if (komik) {
      setTitle(komik.judul || "");
      setReleasedate(komik.tanggal_rilis || "");
      setDesc(komik.deskripsi || "");
      setAuthor(komik.pengarang || "");
      setScenes(komik.konten);
      setCategory(komik.kategori);
    }
  }, [komik]);

  const submit = () => {
    const options = {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      body:
        "title=" +
        title +
        "&desc=" +
        description +
        "&rd=" +
        releasedate +
        "&author=" +
        author +
        "&id=" +
        id,
    };
    try {
      fetch("https://ubaya.xyz/react/160421050/uas/updatekomik.php", options)
        .then((response) => response.json())
        .then((resjson) => {
          console.log(resjson);
          if (resjson.result === "success") {
            alert(title + " Updated");
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const addKomikKategori = async () => {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "komik_id=" + id + "&kategori_id=" + selectedCategory,
      };
      try {
        const response = await fetch(
          "https://ubaya.xyz/react/160421050/uas/tambahkomikkategori.php",
          options
        );
        response.json().then(async (resjson) => {
          console.log(resjson);
          setTriggerRefresh((prev) => !prev);
        });
      } catch (error) {
        console.error("Failed to add comic category:", error);
      }
    };

    if (selectedCategory) {
      addKomikKategori();
    }
  }, [selectedCategory]);

  const deleteKomikKategori = async (kid: number) => {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "komik_id=" + id + "&kategori_id=" + kid,
    };
    try {
      const response = await fetch(
        "https://ubaya.xyz/react/160421050/uas/deletekomikkategori.php",
        options
      );
      response.json().then(async (resjson) => {
        console.log(resjson);
        setTriggerRefresh((prev) => !prev);
      });
    } catch (error) {
      console.error("Failed to delete comic categories:", error);
    }
  };

  const renderComboBox = () => {
    return (
      <View style={{ marginVertical: 10 }}>
        <RNPickerSelect
          onValueChange={(value) => setSelectedCategory(value)}
          items={categoryOption}
          placeholder={{ label: "Pilih kategori", value: null }}
        />
      </View>
    );
  };

  const renderImageUri = () => {
    if (imageUri !== "") {
      return (
        <View style={styles.centered}>
          <Image
            style={styles.selectedImage}
            resizeMode="contain"
            source={{ uri: imageUri }}
          />
          <Button title="Upload" onPress={uploadScene} />
        </View>
      );
    }
    return null;
  };

  const imgGaleri = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadScene = async () => {
    const data = new FormData();
    data.append("id", id);

    const response = await fetch(imageUri);
    const blob = await response.blob();
    data.append("image", blob, "scene.png");

    const options = {
      method: "POST",
      body: data,
      headers: {},
    };

    try {
      fetch("https://ubaya.xyz/react/160421050/uas/uploadhalaman.php", options)
        .then((response) => response.json())
        .then((resjson) => {
          console.log(resjson);
          if (resjson.result === "success") alert("sukses");
          setTriggerRefresh((prev) => !prev);
          setImageUri("");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteScene = async (sceneUri) => {
    const fileName = sceneUri.split("/").pop(); // Extract file name from URI

    const formData = new FormData();
    formData.append("id", id);
    formData.append("filename", fileName);

    try {
      const response = await fetch(
        "https://ubaya.xyz/react/160421050/uas/deletehalaman.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const resjson = await response.json();
      if (resjson.result === "success") {
        alert("Scene deleted successfully");
        setScenes((prevScenes) =>
          prevScenes.filter((scene) => scene !== sceneUri)
        );
      } else {
        alert(`Failed to delete scene: ${resjson.message}`);
      }
    } catch (error) {
      console.error("Error deleting scene:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.fontTop}>Judul:</Text>
      <TextInput style={styles.input} onChangeText={setTitle} value={title} />
      <Text style={styles.fontTop}>Deskripsi:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setDesc}
        value={description}
      />
      <Text style={styles.fontTop}>Tanggal Rilis:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setReleasedate}
        value={releasedate}
      />
      <Text style={styles.fontTop}>Nama Pengarang:</Text>
      <TextInput style={styles.input} onChangeText={setAuthor} value={author} />
      <Button
        title="Update"
        style={{ marginBottom: 20 }}
        onPress={() => submit()}
      />
      <Text style={styles.fontTop}>Kategori:</Text>
      <FlatList
        data={category}
        keyExtractor={(item) => item.kategori}
        renderItem={({ item }) => (
          <View>
            <Text>{item.kategori}</Text>
            <Button
              buttonStyle={{ backgroundColor: "rgba(214, 61, 57, 1)" }}
              icon={{
                name: "trash",
                type: "font-awesome",
                size: 15,
                color: "white",
              }}
              onPress={() => deleteKomikKategori(item.id)}
            />
          </View>
        )}
      />
      {renderComboBox()}

      <Text style={styles.fontTop}>Scenes:</Text>
      <FlatList
        data={scenes}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View>
            <View style={styles.centered}>
              <Image
                style={styles.sceneImage}
                resizeMode="contain"
                source={{
                  uri: "https://ubaya.xyz/react/160421050/uas/" + item,
                }}
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteScene(item)}
              >
                <Text style={styles.deleteButtonText}>DELETE</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        nestedScrollEnabled={true}
        scrollEnabled={false}
      />
      <View style={styles.containerUpload}>
        <Text style={styles.fontTop}>Upload Scene:</Text>
        <RBSheet
          ref={refRBSheet}
          height={100}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
            },
          }}
        >
          <View style={styles.viewRow}>
            <Button title="Gallery" onPress={imgGaleri} />
          </View>
        </RBSheet>

        {renderImageUri()}
        <Button title="Pick Scene" onPress={() => refRBSheet.current.open()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  fontTop: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 40,
    width: "auto",
    borderWidth: 1,
    padding: 10,
    fontFamily: "verdana",
    borderRadius: 8,
    marginBottom: 20,
  },
  viewRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  containerUpload: {
    marginTop: 20,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  sceneImage: {
    width: 350,
    height: 350,
  },
  selectedImage: {
    width: 350,
    height: 350,
    marginBottom: 10,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    width: 120,
    position: "absolute",
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
    bottom: "50%",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
