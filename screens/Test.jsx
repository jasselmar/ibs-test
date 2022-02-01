import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Agenda } from "react-native-calendars";

const Test = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <View
        style={{
          width: "100%",
          height: "55%",
          borderRadius: 6,
          justifyContent: "center",
        }}
      >
        <Agenda />
      </View>
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({});
