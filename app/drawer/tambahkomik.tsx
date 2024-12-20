import React, { useEffect, useState, useRef } from 'react';
import {
  ScrollView,
  Text,
  View,
  FlatList,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';

export default function TambahKomik() {
  const [title, setTitle] = useState('');
  const [releasedate, setReleasedate] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [description, setDesc] = useState('');
  const [author, setAuthor] = useState('');
  const [scenes, setScenes] = useState(null);

  const [movieDetails, setMovieDetails] = useState({
    title: '',
    releasedate: '',
    thumbnail: '',
    description: '',
    author: '',
    scenes: null
  });
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const refRBSheet = useRef();
  const [imageUri, setImageUri] = useState('');
  const [movieId, setMovieId] = useState('1');
  const params = useLocalSearchParams();


  const renderImageUri = () => {
    if (imageUri !== '') {
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
    data.append('movie_id', movieId);

    const response = await fetch(imageUri);
    const blob = await response.blob();
    data.append('image', blob, 'scene.png');

    const options = {
      method: 'POST',
      body: data,
      headers: {},
    };

    try {
      fetch('https://ubaya.xyz/react/160421050/uas/uploadhalaman.php', options)
        .then(response => response.json())
        .then(resjson => {
          console.log(resjson);
          if (resjson.result === 'success') alert('sukses');
          setTriggerRefresh(prev => !prev);
          setImageUri("");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const tambahKomik = async () => {

  };
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.fontTop}>Judul:</Text>
      <Text style={styles.fontTop}>Deskripsi:</Text>
      <Text style={styles.fontTop}>Tanggal Rilis:</Text>
      
      <Text style={styles.fontTop}>Kategori:</Text>

      <Button title='Tambah Kategori' onPress={() => tambahKomik()} />


      <View style={styles.containerUpload}>
        <Text style={styles.fontTop}>Upload Scene:</Text>
        <RBSheet
          ref={refRBSheet}
          height={100}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center"
            }
          }}
        >
          <View style={styles.viewRow}>
            <Button title="Gallery" onPress={imgGaleri} />
          </View>
        </RBSheet>

        {renderImageUri()}
        <Button title='Pick Scene' onPress={() => refRBSheet.current.open()} />
        <Button title='Tambah Komik' onPress={() => tambahKomik()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  fontTop:{
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20
  },
  viewRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center',
    marginVertical: 10
  },
  containerUpload: {
    marginTop: 20
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
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
    width:120,
    position: 'absolute',
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    bottom: "50%",
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: "bold",
  },
});
