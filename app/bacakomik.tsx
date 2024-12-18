import React, { useEffect, useState } from "react";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, FlatList, StyleSheet, Image, ScrollView, ActivityIndicator } from "react-native";

export default function BacaKomik() {
  const { id } = useLocalSearchParams();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchComicDetails = async () => {
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
        setComic(json.data);
      } else {
        alert("Failed to load comic details");
      }
    } catch (error) {
      console.error("Error fetching comic details:", error);
    } finally {
      setLoading(false); // Selesai memuat data
    }
  };

  useEffect(() => {
    fetchComicDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!comic) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load.</Text>
      </View>
    );
  }

  // Format tanggal rilis
  const formattedDate = formatDate(comic.tanggal_rilis);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardcontainer}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Image source={{ uri: comic.thumbnail }} style={styles.thumbnail} />
            <View style={styles.cardInfo}>
              <Text style={styles.title}>{comic.judul}</Text>
              <Text style={styles.info}>
                <Text style={styles.infoLabel}>Categorys: </Text>
                Belumm, kiw kiw, omagaaa
              </Text>
              <Text style={styles.info}>
                <Text style={styles.infoLabel}>Tanggal Rilis: </Text>
                {formattedDate}
              </Text>
              <Text style={styles.info}>
                <Text style={styles.infoLabel}>Rating: </Text>
                {comic.rating}/5
              </Text>
              <Link
                push
                href={{
                  pathname: "/updatekomik",
                  params: { movieid: id },
                }}
                style={styles.editLink} // Apply style here
              >Edit</Link>
            </View>
          </View>

          <Text style={styles.info}>
            <Text style={styles.infoLabel}>Pengarang: </Text>
            {comic.pengarang}
          </Text>
          <Text style={styles.description}>{comic.deskripsi}</Text>
        </View>
      </View>
      <FlatList
        data={comic.konten}
        keyExtractor={(item) => item}
        contentContainerStyle={{ alignItems: "center" }}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={{ uri: 'https://ubaya.xyz/react/160421050/uas/' + item }}
            />
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  cardcontainer: {
    padding: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 20,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  thumbnail: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    color: "#ff0000",
    fontSize: 18,
    fontWeight: "bold",
  },

  editLink: {
    marginTop: 4,
    paddingVertical: 6,
    backgroundColor: "#007BFF",
    color: "#fff",
    textAlign: "center",
    borderRadius: 5,
    fontWeight: "bold",
  },
  imageContainer: {
    width: 360,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: 400,
    height: 780,
    resizeMode: "contain",
  },


});
