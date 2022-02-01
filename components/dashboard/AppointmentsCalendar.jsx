import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { Alert, StyleSheet } from "react-native";
import { Layout, Text, Icon, Button } from "@ui-kitten/components";
import { Calendar } from "react-native-calendars";
import { useThemeContext } from "../../contexts/ThemeContext";
import { fs } from "../../firebase/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import Splash from "../Splash";

const AppointmentsCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  let appointments = [];
  const [items, setItems] = useState();
  const { themeMode } = useThemeContext();
  const { singedIn, currentUser } = useAuth();
  const navigation = useNavigation();
  const today = new Date();

  const AppointmentItem = ({ item }) => {
    return (
      <Layout
        style={{
          padding: 10,
          marginTop: 25,
          marginRight: 15,
          justifyContent: "space-between",
          borderRadius: 6,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Layout>
          <Text category="s1">{item.service}</Text>
          <Text category="c1" style={{ marginTop: 5 }}>
            Since {item.requested}
          </Text>
        </Layout>
        {item.status === "pending" ? (
          <Layout style={{ flexDirection: "row", alignItems: "center" }}>
            <Text category="p1" style={{ marginRight: 3, color: "#F3AE3D" }}>
              Pending
            </Text>
            <Icon
              name="alert-circle-outline"
              width={15}
              height={15}
              fill="#F3AE3D"
            />
          </Layout>
        ) : item.status === "confirmed" ? (
          <Layout style={{ flexDirection: "row", alignItems: "center" }}>
            <Text category="p1" style={{ marginRight: 3, color: "#66DD9C" }}>
              Confirmed
            </Text>
            <Icon
              name="checkmark-circle-2-outline"
              width={15}
              height={15}
              fill="#66DD9C"
            />
          </Layout>
        ) : (
          <Layout style={{ flexDirection: "row", alignItems: "center" }}>
            <Text category="p1" style={{ marginRight: 3, color: "#EB4F73" }}>
              Declined
            </Text>
            <Icon
              name="close-circle-outline"
              width={15}
              height={15}
              fill="#EB4F73"
            />
          </Layout>
        )}
      </Layout>
    );
  };

  const getAppointments = () => {
    const userRef = fs.doc(`users/${currentUser.uid}`);
    fs
      .collection("appointments")
      .where("client", "==", userRef)
      .onSnapshot((querySnapshot) => {
        if (querySnapshot.size > 0) {
          querySnapshot.forEach((appointment) => {
            appointments = [...appointments, appointment.data()];
          });
          formatAppointments();
        } else {
          setLoading(false);
        }
      }),
      () => Alert.alert("Error on loading appointments");
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

  const formatDate = (date) => {
    return `${date.getFullYear()}-${
      date.getMonth() >= 12
        ? date.getMonth()
        : date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1
    }-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
  };

  useEffect(() => {
    if (singedIn) {
      const unsubscribe = getAppointments();
      return unsubscribe;
    } else {
      return;
    }
  }, []);

  if (loading && singedIn) {
    return <Splash />;
  }

  return (
    <Layout style={{ width: "90%", height: "55%", borderRadius: 6 }}>
      <Layout
        style={{
          marginBottom: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text category="s1">My appointments</Text>
      </Layout>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={items}
        minDate={formatDate(today)}
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
        }}
      />
    </Layout>
  );
};

export default AppointmentsCalendar;
