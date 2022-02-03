import React, { useEffect, useState } from "react";
import { StyleSheet, Alert, RefreshControl } from "react-native";
import {
  Text,
  Layout,
  List,
  ListItem,
  Button,
  Icon,
  Spinner,
} from "@ui-kitten/components";
import Header from "../components/Header";
import { fs } from "../firebase/firebase";
import { useAuth } from "../contexts/AuthContext";
import { useThemeContext } from "../contexts/ThemeContext";
import SplashScreen from "./SplashScreen";
import { useNavigation } from "@react-navigation/native";

const LoadingIndicator = (props) => (
  <Layout
    style={{
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
    }}
  >
    <Spinner size="tiny" status="basic" />
  </Layout>
);

const SingleListScreen = ({ route }) => {
  const { date } = route.params;
  const { singedIn, currentUser } = useAuth();
  const { themeMode } = useThemeContext();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [items, setItems] = useState([]);
  const [refresh, setRefresh] = useState(false);
  let appointments = [];
  let results = [];
  const navigation = useNavigation();

  console.log(date);

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
      setIsAdmin(true);
      fs.collection("appointments")
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size > 0) {
            querySnapshot.forEach((documentSnapshot) => {
              appointments = [...appointments, documentSnapshot.data()];
            });
            filterAppointments();
          } else {
            setLoading(false);
          }
        });
    } else {
      fs.collection("appointments")
        .where("client", "==", userRef)
        .get()
        .then((querySnapshot) => {
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
    setRefresh(false);
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

  //Appointment

  const Appointment = ({ item, index }) => {
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
          setRefresh(true);
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
          setRefresh(true);
          getAppointments();
        });
    };

    const Confirmed = () => (
      <Layout
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
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
      <Layout
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
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

    const Pending = () => (
      <Layout
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
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
    );

    const Status = (status) => {
      switch (status) {
        case "confirmed":
          return <Confirmed />;
        case "declined":
          return <Declined />;
        default:
          return <Pending />;
      }
    };

    return (
      <ListItem
        style={{
          borderBottomWidth: 1,
          borderBottomColor: themeMode === "dark" ? "#111425" : "#EEEEEE",
          borderRadius: 15,
          marginTop: 10,
          paddingVertical: 10,
          paddingHorizontal: 10,
          flexDirection: "row",
          width: "95%",
          marginHorizontal: 10,
          justifyContent: "space-around",
          alignItems: "center",
        }}
        onPress={() => navigation.navigate("AppointmentScreen", { item })}
      >
        <Layout style={{ backgroundColor: "transparent" }}>
          <Text category="s1">{item.service}</Text>
          <Text category="s2" style={{ marginTop: 5 }}>
            {formatDateTime(item.datetime.toDate())}
          </Text>
          <Text category="p2" style={{ width: 250, marginTop: 8 }}>
            {item.notes}
          </Text>
        </Layout>
        {(item.status === "pending") & isAdmin ? (
          <Layout
            style={{ flexDirection: "row", backgroundColor: "transparent" }}
          >
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
        ) : (
          Status(item.status)
        )}
      </ListItem>
    );
  };

  const onRefresh = () => {
    setRefresh(true);
    getAppointments();
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
      <Layout
        style={{
          marginHorizontal: 10,
          marginVertical: 20,
          paddingHorizontal: 15,
        }}
      >
        <Text style={{ fontWeight: "600" }}>
          Appointments requests for{" "}
          {`${date.year}-${date.month < 10 ? `0${date.month}` : date.month}-${
            date.day < 10 ? `0${date.day}` : date.day
          }`}
        </Text>
        <Text style={{ marginTop: 5 }} category="p1">
          Pull list down to refresh
        </Text>
      </Layout>
      {singedIn ? (
        refresh ? (
          <Layout
            style={{ flex: 1, paddingTop: 20, alignItems: "center" }}
            level="2"
          >
            <Spinner />
          </Layout>
        ) : (
          <List
            data={items}
            renderItem={Appointment}
            refreshControl={
              <RefreshControl
                onRefresh={onRefresh}
                refreshing={refresh}
                tintColor="transparent"
              />
            }
          />
        )
      ) : (
        <EmptyDay />
      )}
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
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
