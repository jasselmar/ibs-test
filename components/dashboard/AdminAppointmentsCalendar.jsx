import React, { useEffect, useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { Text, Layout } from "@ui-kitten/components";
import { Calendar } from "react-native-calendars";
import { useThemeContext } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { fs } from "../../firebase/firebase";
import Splash from "../Splash";
import { useNavigation } from "@react-navigation/native";

const AdminAppointmentsCalendar = () => {
  const { themeMode } = useThemeContext();
  const { singedIn } = useAuth();
  const [items, setItems] = useState();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  let appointments = [];

  const formatDate = (date) => {
    return `${date.getFullYear()}-${
      date.getMonth() >= 12
        ? date.getMonth()
        : date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1
    }-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
  };

  const getAppointments = () => {
    if (true) {
      fs
        .collection("appointments")
        .where("status", "!=", "declined")
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((documentSnapshot) => {
            appointments = [...appointments, documentSnapshot.data()];
          });
          formatAppointments();
        }),
        () => Alert.alert("Error on loading appointments");
    }
  };

  const formatAppointments = () => {
    let result = {};
    if (!singedIn || appointments === undefined) return;
    else {
      appointments.forEach((item) => {
        result[formatDate(item.datetime.toDate())] = { marked: true };
      });
      setItems(result);
      setLoading(false);
    }
  };

  const handleDayPress = (date) => {
    navigation.navigate("SingleListScreen", { date });
  };

  useEffect(() => {
    if (singedIn) {
      const unsubscribe = getAppointments();
      return unsubscribe;
    } else {
      return;
    }
  }, []);

  if (loading) {
    return <Splash />;
  }

  return (
    <Layout
      style={{ width: "90%", height: "60%", borderRadius: 6, marginTop: 25 }}
    >
      <Calendar
        onDayPress={handleDayPress}
        markedDates={items}
        minDate={formatDate(new Date())}
        style={{
          marginBottom: 15,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: themeMode === "dark" ? "#111425" : "#EDF1F7",
        }}
        theme={{
          todayBackgroundColor: "#1A34B8",
          selectedDayBackgroundColor: "#3366FF",
          todayTextColor: "white",
          arrowColor: "#1A34B8",
        }}
      />
    </Layout>
  );
};

export default AdminAppointmentsCalendar;

const styles = StyleSheet.create({});
