import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import {
  Text,
  Layout,
  List,
  ListItem,
  Button,
  Icon,
  Divider,
} from "@ui-kitten/components";
import Header from "../components/Header";
import { fs } from "../firebase/firebase";
import { useAuth } from "../contexts/AuthContext";
import { useThemeContext } from "../contexts/ThemeContext";
import SplashScreen from "./SplashScreen";

const SingleListScreen = ({ route }) => {
  const { date } = route.params;
  const { singedIn, currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, SetIsAdmin] = useState(false);
  const [items, setItems] = useState();
  const { themeMode } = useThemeContext();
  let appointments = [];
  let results = [];

  const EmptyDay = () => {
    return (
      <Layout
        level="2"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Layout
          level="2"
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Icon
            name="alert-circle-outline"
            width={22}
            height={22}
            fill={themeMode === "dark" ? "white" : "black"}
            status="info"
          />
          {singedIn ? (
            <Text>You have no appointments for this day</Text>
          ) : (
            <Text>
              You need to{" "}
              <Text
                style={{ textDecorationLine: "underline" }}
                onPress={() => navigation.navigate("RegisterScreen")}
              >
                register
              </Text>{" "}
              or{" "}
              <Text
                style={{ textDecorationLine: "underline" }}
                onPress={() => navigation.navigate("LoginScreen")}
              >
                log in
              </Text>
            </Text>
          )}
        </Layout>
      </Layout>
    );
  };

  const getAppointments = async () => {
    const userRef = fs.doc(`users/${currentUser.uid}`);
    const snapShot = await userRef.get();

    if (snapShot.data().admin) {
      SetIsAdmin(true);
      fs.collection("appointments").onSnapshot((querySnapshot) => {
        if (querySnapshot.size > 0) {
          querySnapshot.forEach((documentSnapshot) => {
            appointments = [...appointments, documentSnapshot.data()];
          });
          filterAppointments();
        } else {
          setLoading(false);
        }
      }),
        () => Alert.alert("Error on loading appointments");
    } else {
      fs.collection("appointments")
        .where("client", "==", userRef)
        .onSnapshot((querySnapshot) => {
          if (querySnapshot.size > 0) {
            querySnapshot.forEach((documentSnapshot) => {
              appointments = [...appointments, documentSnapshot.data()];
            });
            filterAppointments();
          } else {
            setLoading(false);
          }
        });
    }
  };

  const filterAppointments = () => {
    results = appointments.filter(
      (appointment) =>
        formatDate(appointment.datetime.toDate()) ===
        `${date.year}-${date.month < 10 ? `0${date.month}` : date.month}-${
          date.day < 10 ? `0${date.day}` : date.day
        }`
    );
    setItems(results);
    setLoading(false);
  };

  const renderItem = ({ item, index }) => {
    const handleDecline = () => {
      fs.collection("appointments")
        .where("appointmentId", "==", item.appointmentId)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((appointment) => {
            appointment.ref.update({
              status: "declined",
            });
          });
        })
        .then(() => {
          setLoading(true);
          getAppointments();
        });
    };

    const handleConfirm = () => {
      fs.collection("appointments")
        .where("appointmentId", "==", item.appointmentId)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((appointment) => {
            appointment.ref.update({
              status: "confirmed",
            });
          });
        })
        .then(() => {
          setLoading(true);
          getAppointments();
        });
    };

    const Confirmed = () => (
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
    );

    const Declined = () => (
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
    );

    return (
      <ListItem
        style={{
          borderBottomWidth: 1,
          borderBottomColor: themeMode === "dark" ? "#111425" : "#EEEEEE",
        }}
      >
        <Layout
          style={{
            paddingVertical: 5,
            paddingHorizontal: 10,
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Layout>
            <Text category="s1">{`${item.service}`}</Text>
            <Text category="s2" style={{ marginTop: 5 }}>
              {formatDateTime(item.datetime.toDate())}
            </Text>
            <Text category="p2" style={{ width: 250, marginTop: 8 }}>
              {item.notes}
            </Text>
          </Layout>
          {(item.status === "pending") & isAdmin ? (
            <Layout style={{ flexDirection: "row" }}>
              <Button
                style={{ height: 40, marginRight: 10 }}
                onPress={handleDecline}
                accessoryLeft={() => (
                  <Icon
                    name="close-outline"
                    width={20}
                    height={20}
                    fill="white"
                  />
                )}
                size="tiny"
                status="danger"
              ></Button>
              <Button
                style={{ height: 40 }}
                onPress={handleConfirm}
                accessoryLeft={() => (
                  <Icon
                    name="checkmark-outline"
                    width={20}
                    height={20}
                    fill="white"
                  />
                )}
                size="tiny"
                status="success"
              ></Button>
            </Layout>
          ) : item.status === "confirmed" ? (
            <Confirmed />
          ) : (
            <Declined />
          )}
        </Layout>
      </ListItem>
    );
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

  const formatDateTime = (datetime) => {
    if (datetime === "") return;
    const formattedDate = `${datetime.getFullYear()}-${
      datetime.getMonth() >= 12 ? datetime.getMonth() : datetime.getMonth() + 1
    }-${datetime.getDate()} | ${
      datetime.getHours() === 0
        ? 12
        : datetime.getHours() > 12
        ? datetime.getHours() - 12
        : datetime.getHours()
    }:${
      datetime.getMinutes() < 10
        ? "0" + datetime.getMinutes()
        : datetime.getMinutes()
    } ${datetime.getHours() >= 12 ? "PM" : "AM"}`;
    return formattedDate;
  };

  useEffect(() => {
    if (singedIn) {
      const unsubscribe = getAppointments();
      return unsubscribe;
    } else {
      setLoading(false);
      return;
    }
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Layout style={{ flex: 1 }}>
      <Header backButton={true} />
      <Layout style={{ marginHorizontal: 10, marginVertical: 20 }}>
        <Text category="h6">
          Appointments requests for{" "}
          {`${date.year}-${date.month < 10 ? `0${date.month}` : date.month}-${
            date.day < 10 ? `0${date.day}` : date.day
          }`}
        </Text>
      </Layout>
      {singedIn ? <List data={items} renderItem={renderItem} /> : <EmptyDay />}
    </Layout>
  );
};

export default SingleListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
