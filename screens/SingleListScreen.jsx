import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Alert,
} from "react-native";
import {
  Text,
  Layout,
  List,
  ListItem,
  Button,
  Icon,
  Modal,
  CheckBox,
  Input,
} from "@ui-kitten/components";
import Header from "../components/Header";
import { fs } from "../firebase/firebase";
import { useAuth } from "../contexts/AuthContext";
import { useThemeContext } from "../contexts/ThemeContext";
import SplashScreen from "./SplashScreen";
import ValidationError from "../components/ValidationError";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useFormik } from "formik";

const SingleListScreen = ({ route }) => {
  const { date } = route.params;
  const { singedIn, currentUser } = useAuth();
  const { themeMode } = useThemeContext();
  const [loading, setLoading] = useState(true);
  const [isAdmin, SetIsAdmin] = useState(false);
  const [items, setItems] = useState();
  let appointments = [];
  let results = [];
  const [editAppointmentModalVisible, SetEditAppointmentModalVisible] =
    useState(false);

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

    const Pending = () => (
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

    //formik

    return (
      <ListItem
        style={{
          borderBottomWidth: 1,
          borderBottomColor: themeMode === "dark" ? "#111425" : "#EEEEEE",
          borderRadius: 15,
          marginBottom: 10,
          marginHorizontal: 2,
        }}
      >
        <Layout
          style={{
            paddingVertical: 5,
            paddingHorizontal: 10,
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-around",
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
          ) : (
            Status(item.status)
          )}
          <TouchableOpacity
            onPress={() => SetEditAppointmentModalVisible(true)}
          >
            <Icon
              name="more-vertical-outline"
              width={30}
              height={30}
              fill="gray"
            />
          </TouchableOpacity>
          <Modal
            style={{ width: "90%" }}
            visible={editAppointmentModalVisible}
            backdropStyle={styles.backdrop}
            onBackdropPress={() => {
              clearForm();
            }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={styles.container}
              >
                <Layout
                  style={{
                    width: "100%",
                    paddingVertical: 30,
                    paddingHorizontal: 25,
                    borderRadius: 6,
                  }}
                >
                  <Text category="h6" style={{ marginBottom: 16 }}>
                    Edit appointment🗓️✏️
                  </Text>
                  <Layout style={{ marginBottom: 16, flexDirection: "row" }}>
                    <CheckBox
                    //checked={consultation}
                    /* status={
                        touched.service && errors.service ? "danger" : "basic"
                      } */
                    /* onChange={(c) => {
                        if (consultation === true) {
                          setConsultation(false);
                          setFieldValue("service", "", true);
                          setFieldTouched("service", true, false);
                        } else {
                          setConsultation(true);
                          setTherapy(false);
                          setSurgery(false);
                          setFieldValue("service", "Consultation", true);
                        }
                      }} */
                    >
                      Consultation
                    </CheckBox>

                    <CheckBox
                    //checked={therapy}
                    /* status={
                        touched.service && errors.service ? "danger" : "basic"
                      } */
                    /* onChange={(c) => {
                        if (therapy === true) {
                          setTherapy(false);
                          setFieldValue("service", "", true);
                          setFieldTouched("service", true, false);
                        } else {
                          setTherapy(c);
                          setConsultation(false);
                          setSurgery(false);
                          setFieldValue("service", "Therapy", true);
                        }
                      }} */
                    >
                      Therapy
                    </CheckBox>

                    <CheckBox
                    //checked={surgery}
                    /* status={
                        touched.service && errors.service ? "danger" : "basic"
                      } */
                    /* onChange={(c) => {
                        if (surgery === true) {
                          setSurgery(false);
                          setFieldValue("service", "", true);
                          setFieldTouched("service", true, false);
                        } else {
                          setSurgery(c);
                          setConsultation(false);
                          setTherapy(false);
                          setFieldValue("service", "Surgery", true);
                        }
                      }} */
                    >
                      Surgery
                    </CheckBox>
                  </Layout>
                  <Layout style={{ marginTop: -5, marginBottom: 11 }}>
                    {/* {touched.service && errors.service && (
                      <ValidationError message={errors.service} />
                    )} */}
                  </Layout>

                  <Layout style={{ marginBottom: 16 }}>
                    <Input
                      //value={formatDateTime(values.datetime)}
                      //onFocus={showTimePicker}
                      placeholder="Date | Time"
                      name="datetime"
                      /* status={
                        touched.datetime && errors.datetime ? "danger" : "basic"
                      } */
                      accessoryLeft={() => (
                        <Icon
                          name="calendar"
                          height={22}
                          width={22}
                          fill={
                            themeMode === "dark"
                              ? "rgba(51, 102, 255, 0.48)"
                              : "rgba(51, 102, 255, 0.24)"
                          }
                        />
                      )}
                    />
                    {/* {touched.datetime && errors.datetime && (
                      <ValidationError message={errors.datetime} />
                    )} */}
                    <DateTimePickerModal
                      minimumDate={new Date()}
                      display={Platform.OS === "ios" ? "inline" : "default"}
                      //onConfirm={handleConfirmTime}
                      //onCancel={hideTimePicker}
                      //isVisible={isTimePickerVisible}
                      mode="datetime"
                    />
                  </Layout>

                  <Layout style={{ marginBottom: 16 }}>
                    <Input
                      //onChangeText={handleChange("notes")}
                      //onBlur={handleBlur("notes")}
                      placeholder="Notes"
                      name="notes"
                      textStyle={{ minHeight: 64 }}
                      multiline={true}
                      caption={() => (
                        <Text
                          appearance="hint"
                          category="s2"
                          style={{ marginTop: 5 }}
                        >
                          Optional
                        </Text>
                      )}
                      /* status={
                        touched.notes && errors.notes ? "danger" : "basic"
                      } */
                      accessoryLeft={() => (
                        <Layout
                          style={{
                            height: "90%",
                            backgroundColor: "transparent",
                          }}
                        >
                          <Icon
                            name="attach-2"
                            height={22}
                            width={22}
                            fill={
                              themeMode === "dark"
                                ? "rgba(51, 102, 255, 0.48)"
                                : "rgba(51, 102, 255, 0.24)"
                            }
                          />
                        </Layout>
                      )}
                    />
                    {/* {touched.notes && errors.notes && (
                      <ValidationError message={errors.notes} />
                    )} */}
                  </Layout>

                  <Button
                  //onPress={handleSubmit}
                  //accessoryLeft={isSubmitting ? LoadingIndicator : null}
                  >
                    Request
                  </Button>
                </Layout>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </Modal>
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
