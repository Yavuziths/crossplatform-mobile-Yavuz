import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { ToastProvider } from "react-native-toast-notifications";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import i18n from "./i18n";
import PostForm from "./src/screens/PostForm/PostForm";
import PostList from "./src/screens/PostList/PostList";
import { Settings } from "./src/screens/Settings/Settings";
import { UserForm } from "./src/screens/UserForm/UserForm";
import { UserInfo } from "./src/screens/UserInfo/UserInfo";
import UserList from "./src/screens/UserList/UserList";
import { persistor, store, RootState } from "./src/store/store";

const UserListStack = createNativeStackNavigator();
const PostStack = createNativeStackNavigator();

const UserListStackScreen = () => {
  return (
    <UserListStack.Navigator>
      <UserListStack.Screen name="UserList" component={UserList} />
      <UserListStack.Screen name="UserInfo" component={UserInfo} />
    </UserListStack.Navigator>
  );
};

const PostStackScreen = () => {
  return (
    <PostStack.Navigator>
      <PostStack.Screen
        name="PostList"
        component={PostList}
        options={{ title: "Posts" }}
      />
      <PostStack.Screen
        name="PostForm"
        component={PostForm}
        options={{ title: "Create Post" }}
      />
    </PostStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const NavigationWrapper = () => {
  const loggedInAs = useSelector((state: RootState) => state.auth.loggedInAs);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="User List"
          component={UserListStackScreen}
          options={{ headerShown: false }}
        />
        {/* Only include this if you want UserForm to be directly accessible from the tab bar */}
        <Tab.Screen
          name="UserForm"
          component={UserForm}
          options={{ title: "User Form" }}
        />
        <Tab.Screen
          name="Posts"
          component={PostStackScreen}
          options={{ headerShown: false }}
        />
        {/* Add a separate tab for PostForm if needed */}
        <Tab.Screen
          name="Create Post"
          component={PostForm}
          options={{ title: "Create Post" }}
        />
        {loggedInAs && (
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{
              title: `${loggedInAs.firstName} ${loggedInAs.lastName}`,
            }}
          />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <I18nextProvider i18n={i18n}>
            <NavigationWrapper />
          </I18nextProvider>
        </PersistGate>
      </Provider>
    </ToastProvider>
  );
}
