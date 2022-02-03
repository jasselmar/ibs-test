import React from "react";
import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Dashboard from "./screens/Dashboard";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import SingleListScreen from "./screens/SingleListScreen";
import AppointmentScreen from "./screens/AppointmentScreen";

const Stack = createNativeStackNavigator();

const UserStack = () => {
  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SingleListScreen" component={SingleListScreen} />
        <Stack.Screen name="AppointmentScreen" component={AppointmentScreen} />
      </Stack.Navigator>
    </>
  );
};

export default UserStack;

const styles = StyleSheet.create({});
