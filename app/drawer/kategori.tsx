import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Kategori() {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://ubaya.xyz/react/160421050/uas/kategori.php");
      const json = await response.json();
      setCategories(json.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Kategori</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link
            push
            href={{ pathname: "/daftarkomik", params: { id: item.id, nameCate: item.nama} }}
            style={styles.categoryButton}
          >
            <Text style={styles.categoryText}>{item.nama}</Text>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
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
    marginVertical: 5,
    alignItems: "center",
  },
  categoryText: {
    color: "#fff",
    fontSize: 16,
  },
});
