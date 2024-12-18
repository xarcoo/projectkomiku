import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

export default function Index() {
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch("https://ubaya.xyz/react/160421050/uas/kategori.php");
      const json = await response.json();
      setCategories(json.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Unified fetch for search and initial load
  const searchComics = async (query = "") => {
    try {
      const options = {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/x-www-form-urlencoded",
        }),
        body: "cari=" + query,
      };
      const response = await fetch(
        "https://ubaya.xyz/react/160421050/uas/komik.php",
        options
      );
      const json = await response.json();

      if (json.result === "success") {
        setResults(json.data);
      } else {
        alert("Failed to fetch comics");
      }
    } catch (error) {
      console.error("Error searching comics:", error);
    }
  };
  const searchComicsCategory = async (query = "") => {
    try {
      const options = {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/x-www-form-urlencoded",
        }),
        body: "kategori=" + query,
      };
      const response = await fetch(
        "https://ubaya.xyz/react/160421050/uas/komik.php",
        options
      );
      const json = await response.json();
      console.log(json);
      if (json.result === "success") {
        setResults(json.data);
      } else {
        alert("Failed to fetch comics");
      }
    } catch (error) {
      console.error("Error searching comics:", error);
    }
  };

  // Load categories and comics on mount
  useEffect(() => {
    fetchCategories();
    searchComics(); // Fetch initial data with empty search string
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search comics..."
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => searchComics(searchText)}
      >
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

      {/* Categories Section */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => searchComicsCategory(item.id.toString())}
          >
            <Text style={styles.categoryText}>{item.nama}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Search Results */}
      <Text style={styles.sectionTitle}>Results</Text>
      <FlatList
        data={results}
        key={(results.length > 0).toString()}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Link
            push
            href={{ pathname: "/bacakomik", params: { id: item.id } }}
            style={styles.comicCard}
          >
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.comicImage}
              resizeMode="cover"
            />
            <Text style={styles.comicText}>{item.judul}</Text>
          </Link>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  categoryButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryText: {
    color: "#fff",
    fontSize: 14,
  },
  comicCard: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
  },
  comicImage: {
    width: "100%",
    height: 190,
    borderRadius: 8,
  },
  comicText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  searchButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8, // Membuat tombol rounded
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10, // Memberi jarak atas-bawah
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

});
