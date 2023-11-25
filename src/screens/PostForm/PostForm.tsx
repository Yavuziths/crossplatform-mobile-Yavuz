import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import { useCreatePostMutation } from "../../store/api/postsApi";

const PostForm = () => {
  const [postText, setPostText] = useState("");
  const loggedInUserId = useSelector((state) => state.auth.loggedInAs?.id);
  const [createPost, { isLoading }] = useCreatePostMutation();

  const navigation = useNavigation();

  const handleCreatePost = async () => {
    if (!postText.trim()) {
      alert("Please enter some text for the post");
      return;
    }

    const newPost = {
      text: postText,
      createdBy: loggedInUserId,
      createdDate: new Date().toISOString(),
    };

    try {
      await createPost(newPost).unwrap();
      navigation.navigate("Posts");
      setPostText("");
    } catch (error) {
      alert("Error creating post");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={postText}
        onChangeText={setPostText}
        placeholder="Berätta mer?"
        multiline
      />
      <Button
        title="Create post"
        onPress={handleCreatePost}
        disabled={isLoading}
      />
    </View>
  );
};

// Styles for the PostForm component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    width: "100%",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default PostForm;
