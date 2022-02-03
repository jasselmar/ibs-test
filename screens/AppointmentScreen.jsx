import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Alert,
} from "react-native";
import {
  Text,
  Layout,
  Button,
  Icon,
  CheckBox,
  Input,
  Modal,
  Spinner,
} from "@ui-kitten/components";
import ValidationError from "../components/ValidationError";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useThemeContext } from "../contexts/ThemeContext";
import Header from "../components/Header";
import SplashScreen from "./SplashScreen";
import { useNavigation } from "@react-navigation/native";
import { fs } from "../firebase/firebase";
import LottieView from "lottie-react-native";

const EditAppointmentSchema = Yup.object({
  service: Yup.string().min(2, "Required").required("Required"),
  datetime: Yup.date().required("Required"),
  notes: Yup.string().max(80, "Too long!"),
});

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

const AppointmentScreen = ({ route }) => {
  const { themeMode } = useThemeContext();
  const { item } = route.params;
  const [loading, setLoading] = useState(true);
  const [consultation, setConsultation] = useState();
  const [therapy, setTherapy] = useState();
  const [surgery, setSurgery] = useState();
  const [disableSave, setDisableSave] = useState(true);
  const navigation = useNavigation();
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  console.log(item.notes);

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

  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const showTimePicker = () => {
    Keyboard.dismiss();
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleConfirmTime = (datetime) => {
    setFieldValue("datetime", datetime, true);
    setFieldTouched("datetime", true, false);
    setTimePickerVisible(false);
  };

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    values,
    isSubmitting,
    setFieldValue,
    setFieldTouched,
  } = useFormik({
    initialValues: {
      service: item.service,
      datetime: "",
      notes: item.notes,
    },
    validationSchema: EditAppointmentSchema,
    onSubmit: async (values) => {
      return await handleAppointmentUpdate(values);
    },
  });

  const handleAppointmentUpdate = (values) => {
    try {
      fs.collection("appointments")
        .where("appointmentId", "==", item.appointmentId)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((appointment) => {
            appointment.ref.update({
              service: values.service,
              datetime: values.datetime,
              notes: values.notes,
            });
          });
        })
        .then(() => {
          setSuccessModalVisible(true);
        });
    } catch (error) {
      Alert.alert("Error updating your appointment");
      console.log(error.message, error);
      throw error;
    }
  };

  const clearForm = () => {
    setFieldTouched("service", false, false);
    setFieldValue("service", "", false);
    setConsultation(false);
    setTherapy(false);
    setSurgery(false);

    setFieldTouched("datetime", false, false);
    setFieldValue("datetime", "", false);

    setFieldTouched("notes", false, false);
    setFieldValue("notes", "", false);
  };

  const fillData = () => {
    if (item.service === "Consultation") {
      setConsultation(true);
      setTherapy(false);
      setSurgery(false);
      setFieldValue("service", "Consultation", false);
    } else if (item.service === "Therapy") {
      setTherapy(true);
      setConsultation(false);
      setSurgery(false);
      setFieldValue("service", "Therapy", false);
    } else if (item.service === "Surgery") {
      setSurgery(true);
      setConsultation(false);
      setTherapy(false);
      setFieldValue("service", "Surgery", false);
    }
    setFieldValue("datetime", item.datetime.toDate(), false);
    setFieldValue("notes", item.notes, false);
    setLoading(false);
  };

  const isSaveable = () => {
    if (touched.notes || touched.datetime || touched.service) {
      setDisableSave(false);
    }
  };

  console.log(touched.notes);
  console.log(values.notes);

  useEffect(() => {
    const unsubscribe = isSaveable();
    return unsubscribe;
  }, [values.service, values.datetime, values.notes]);

  useEffect(() => {
    const unsubscribe = fillData();
    return unsubscribe;
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <>
      <Layout style={{ flex: 1 }}>
        <Header backButton={true} />
        <Modal
          style={{ width: "90%" }}
          visible={successModalVisible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setSuccessModalVisible(false)}
        >
          <Layout
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: 25,
              paddingHorizontal: 15,
              borderRadius: 6,
            }}
          >
            <LottieView
              autoPlay
              loop={false}
              onAnimationFinish={() => setSuccessModalVisible(false)}
              speed={2}
              style={{
                width: 150,
                height: 160,
              }}
              source={require("../assets/success.json")}
            />
            <Text category="s1" style={{ textAlign: "center" }}>
              Your appointment has been updated
            </Text>
          </Layout>
        </Modal>
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
              <Text
                category="h6"
                style={{ marginBottom: 16, fontWeight: "600" }}
              >
                Edit appointment🗓️✏️ (ID #{item.appointmentId})
              </Text>
              <Layout style={{ marginBottom: 16, flexDirection: "row" }}>
                <CheckBox
                  checked={consultation}
                  status={
                    touched.service && errors.service ? "danger" : "basic"
                  }
                  onChange={(c) => {
                    if (consultation === true) {
                      setConsultation(false);
                      setFieldValue("service", "", true);
                    } else {
                      setConsultation(true);
                      setTherapy(false);
                      setSurgery(false);
                      setFieldValue("service", "Consultation", true);
                      setFieldTouched("service", true, false);
                    }
                    setFieldTouched("service", true, false);
                  }}
                >
                  Consultation
                </CheckBox>

                <CheckBox
                  checked={therapy}
                  status={
                    touched.service && errors.service ? "danger" : "basic"
                  }
                  onChange={(c) => {
                    if (therapy === true) {
                      setTherapy(false);
                      setFieldValue("service", "", true);
                    } else {
                      setTherapy(c);
                      setConsultation(false);
                      setSurgery(false);
                      setFieldValue("service", "Therapy", true);
                    }
                    setFieldTouched("service", true, false);
                  }}
                >
                  Therapy
                </CheckBox>

                <CheckBox
                  checked={surgery}
                  status={
                    touched.service && errors.service ? "danger" : "basic"
                  }
                  onChange={(c) => {
                    if (surgery === true) {
                      setSurgery(false);
                      setFieldValue("service", "", true);
                    } else {
                      setSurgery(c);
                      setConsultation(false);
                      setTherapy(false);
                      setFieldValue("service", "Surgery", true);
                    }
                    setFieldTouched("service", true, false);
                  }}
                >
                  Surgery
                </CheckBox>
              </Layout>
              <Layout style={{ marginTop: -5, marginBottom: 11 }}>
                {touched.service && errors.service && (
                  <ValidationError message={errors.service} />
                )}
              </Layout>

              <Layout style={{ marginBottom: 16 }}>
                <Input
                  value={formatDateTime(values.datetime)}
                  onFocus={showTimePicker}
                  placeholder="Date | Time"
                  name="datetime"
                  status={
                    touched.datetime && errors.datetime ? "danger" : "basic"
                  }
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
                {touched.datetime && errors.datetime && (
                  <ValidationError message={errors.datetime} />
                )}
                <DateTimePickerModal
                  minimumDate={new Date()}
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  onConfirm={handleConfirmTime}
                  onCancel={hideTimePicker}
                  isVisible={isTimePickerVisible}
                  mode="datetime"
                />
              </Layout>

              <Layout style={{ marginBottom: 16 }}>
                <Input
                  value={values.notes}
                  onChangeText={handleChange("notes")}
                  onBlur={handleBlur("notes")}
                  onFocus={() => setFieldTouched("notes", true, false)}
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
                  status={touched.notes && errors.notes ? "danger" : "basic"}
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
                {touched.notes && errors.notes && (
                  <ValidationError message={errors.notes} />
                )}
              </Layout>
              <Layout
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Button
                  style={{ marginRight: 10 }}
                  appearance="outline"
                  status="danger"
                  onPress={() => navigation.goBack()}
                >
                  Cancel
                </Button>
                <Button
                  onPress={handleSubmit}
                  disabled={disableSave}
                  accessoryLeft={isSubmitting ? LoadingIndicator : null}
                >
                  Update
                </Button>
              </Layout>
            </Layout>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Layout>
    </>
  );
};

export default AppointmentScreen;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
