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

export default function UpdateKomik() {
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

  useEffect(() => {
    if (params.movieid) {
      setMovieId(params.movieid.toString());
    }
  }, [params.movieid]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const options = {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/x-www-form-urlencoded",
          }),
          body: "id=" + movieId,
        };
        const response = await fetch(
          "https://ubaya.xyz/react/160421050/uas/detailkomik.php",
          options
        );
        const json = await response.json();

        if (json.result === "success") {
          setMovieDetails(json.data);
        } else {
          alert("Failed to load comic details");
        }
      } catch (error) {
        console.error("Error fetching comic details:", error);
      }
    }

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId, triggerRefresh]);

  useEffect(() => {
    if (movieDetails) {
      setTitle(movieDetails.title || '');
      setReleasedate(movieDetails.tanggal_rilis || '');
      setThumbnail(movieDetails.thumbnail || '');
      setDesc(movieDetails.description || '');
      setAuthor(movieDetails.pengarang || '');
      setScenes(movieDetails.konten);
    }
  }, [movieDetails]);

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

  const deleteScene = async (sceneUri) => {
    const fileName = sceneUri.split('/').pop(); // Extract file name from URI
  
    const formData = new FormData();
    formData.append('movie_id', movieId);
    formData.append('filename', fileName);
  
    try {
      const response = await fetch('https://ubaya.xyz/react/160421050/uas/deletehalaman.php', {
        method: 'POST',
        body: formData,
      });
  
      const resjson = await response.json();
      if (resjson.result === 'success') {
        alert('Scene deleted successfully');
        setScenes(prevScenes => prevScenes.filter(scene => scene !== sceneUri));
      } else {
        alert(`Failed to delete scene: ${resjson.message}`);
      }
    } catch (error) {
      console.error('Error deleting scene:', error);
    }
  };
  

  return (
    <ScrollView style={styles.container}>
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
                source={{ uri: 'https://ubaya.xyz/react/160421050/uas/' + item }}
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
