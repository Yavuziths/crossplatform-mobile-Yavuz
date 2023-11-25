import { Input, Button } from "@rneui/themed";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { useToast } from "react-native-toast-notifications";

import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../store/api/usersApi";
export const UserForm = ({ navigation, route }) => {
  const lastNameRef = useRef(null);
  const { t } = useTranslation();
  const isEdit = route.params?.user != null;
  const [firstName, setFirstName] = useState(
    route?.params?.user?.firstName || "",
  );
  const [lastName, setLastName] = useState(route?.params?.user?.lastName || "");
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const toast = useToast();

  const handleSubmit = () => {
    if (firstName === "" || lastName === "") {
      console.log("Invalid form!");
      toast.show("Please fill out all inputs", {
        type: "warning",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
      });
      return;
    }
    if (isEdit) {
      updateUser({ user: { id: route.params.user.id, firstName, lastName } })
        .then(() => {
          navigation.goBack();
          toast.show(`User ${firstName} ${lastName} updated!`, {
            type: "success",
            placement: "top",
            duration: 4000,
            animationType: "slide-in",
          });
        })
        .catch((error) => {
          toast.show(error.message || "An error occurred", { type: "danger" });
        });
    } else {
      createUser({ user: { firstName, lastName } })
        .then(() => {
          navigation.navigate("UserList");
          toast.show(`User ${firstName} ${lastName} created!`, {
            type: "success",
            placement: "top",
            duration: 4000,
            animationType: "slide-in",
          });
          setFirstName("");
          setLastName("");
        })
        .catch((error) => {
          toast.show(error.message || "An error occurred", { type: "danger" });
        });
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.parentContainer}>
        <View style={styles.container}>
          <Text>{isEdit ? "Ändra användare" : "Skapa Användare"}</Text>
          <Input
            returnKeyType="next"
            onSubmitEditing={() => lastNameRef.current.focus()}
            blurOnSubmit={false}
            value={firstName}
            disabled={isLoading}
            onChangeText={setFirstName}
            placeholder={t("Förnamn")}
          />
          <Input
            ref={lastNameRef}
            value={lastName}
            disabled={isLoading}
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            onChangeText={setLastName}
            placeholder={t("Efternamn")}
          />
          <Button
            title={isEdit ? t("updateUser") : t("createUser")}
            disabled={isLoading}
            loading={isLoading}
            onPress={handleSubmit}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: "white",
    borderColor: "#eee",
    borderWidth: 1,
    borderRadius: 16,
  },
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
});
