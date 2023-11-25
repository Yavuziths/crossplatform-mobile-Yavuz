import React from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";

import { useGetPostsQuery } from "../../store/api/postsApi";

const PostList = () => {
  const { data: posts, isLoading, isError } = useGetPostsQuery();

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error occurred while fetching posts.</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(post) => post.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Text style={styles.postText}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  postContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  postText: {
    fontSize: 16,
  },
});

export default PostList;
