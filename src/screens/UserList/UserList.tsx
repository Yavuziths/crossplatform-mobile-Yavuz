import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useToast } from "react-native-toast-notifications";

import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../store/api/usersApi";

const UserList = ({ navigation }) => {
  const { data, isLoading, refetch } = useGetUsersQuery({});
  const [deleteUser] = useDeleteUserMutation();
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const toast = useToast();

  const handleDelete = (userId) => {
    setDeleteUserId(userId);
    setConfirmationModalVisible(true);
  };

  const confirmDelete = async () => {
    if (deleteUserId == null) {
      toast.show("User ID is not set", {
        type: "warning",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
      });
      return;
    }

    try {
      await deleteUser(deleteUserId).unwrap();
      setSuccessModalVisible(true);
      refetch();
    } catch (error) {
      toast.show(error.data?.error?.message || "Failed to delete user", {
        type: "danger",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
      });
    } finally {
      setDeleteUserId(null);
      setConfirmationModalVisible(false);
    }
  };

  return (
    <View>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={data}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <TouchableOpacity
                onPress={() => navigation.navigate("UserInfo", { user: item })}
              >
                <Text
                  style={styles.userName}
                >{`${item.firstName} ${item.lastName}`}</Text>
              </TouchableOpacity>
              <View style={styles.buttonsContainer}>
                <Button
                  title="Edit"
                  onPress={() =>
                    navigation.navigate("UserForm", { user: item })
                  }
                />
                <Button
                  title="Delete"
                  color="red"
                  onPress={() => handleDelete(item.id)}
                />
              </View>
            </View>
          )}
        />
      )}

      {/* Confirmation Modal */}
      <Modal
        visible={isConfirmationModalVisible}
        animationType="slide"
        transparent
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Are you sure you want to delete this user?</Text>
            <Button
              title="Cancel"
              onPress={() => setConfirmationModalVisible(false)}
            />
            <Button title="OK" onPress={confirmDelete} />
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={isSuccessModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>User deleted successfully</Text>
            <Button
              title="OK"
              onPress={() => {
                setSuccessModalVisible(false);
                refetch();
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  userName: {
    fontSize: 18,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default UserList;
