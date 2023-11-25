import React from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";

import { useGetPostsQuery } from "../../store/api/postsApi";
import { useGetUsersQuery } from "../../store/api/usersApi";

const PostList = () => {
  const { data: posts } = useGetPostsQuery({});
  const { data: users } = useGetUsersQuery({});

  const sortedPosts = posts?.slice().sort((a, b) => {
    return new Date(b.createdDate) - new Date(a.createdDate);
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedPosts}
        keyExtractor={(post) => post.id}
        renderItem={({ item }) => {

          const user = users?.find((u) => u.id === item.createdBy);

          return (
            <View style={styles.postContainer}>
              <Text style={styles.postText}>
                {user
                  ? `${user.firstName} ${user.lastName}: `
                  : "Unknown user: "}
                {item.text}
              </Text>
              <Text style={styles.postDate}>{item.createdDate}</Text>
            </View>
          );
        }}
        inverted
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
  postDate: {
    color: "#666",
    fontSize: 12,
  },
});

export default PostList;
