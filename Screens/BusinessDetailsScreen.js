import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Text, Title, IconButton, Paragraph, Button } from "react-native-paper";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

const BusinessDetailsScreen = ({ navigation, route }) => {
  const { business } = route.params;

  return (
    <View>
      <LinearGradient
        colors={["#f25e35", "#ff9c6b"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Businesses")}
          style={{ position: "absolute", top: 16, left: 16, zIndex: 1 }}
        >
          <FontAwesome5Icon
            name="arrow-left"
            size={24}
            color="white"
            style={{ marginBottom: 8 }}
          />
        </TouchableOpacity>{" "}
        {/* Upper Section */}
        <View style={{ flexDirection: "row", padding: 16, marginTop: 24 }}>
          {/* Left Section */}
          <View style={{ flex: 1 }}>
            <Text style={{ color: "white" }} variant="headlineLarge">
              {business.name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 16,
              }}
            >
              <FontAwesome5Icon
                name="map-marker-alt"
                size={20}
                style={{ marginRight: 4, color: "white" }}
              />
              <Paragraph style={{ color: "white" }}>
                {business.address}
              </Paragraph>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 16,
              }}
            >
              <FontAwesome5Icon
                name="star"
                size={20}
                style={{ marginRight: 4, color: "white" }}
              />
              <Paragraph style={{ color: "white" }}>
                {business.rating}
              </Paragraph>
              <Button mode="text" compact textColor="#ffe6a3">
                View Reviews
              </Button>
            </View>
            <View style={{ flexDirection: "row", marginTop: 16 }}>
              <FontAwesome5Icon
                name="heart"
                size={20}
                style={{ marginRight: 4, color: "white" }}
              />
              <Paragraph style={{ color: "white" }}>
                Add to your favorites
              </Paragraph>
            </View>
            <View style={{ flexDirection: "row", marginTop: 16 }}>
              <Button
                icon={() => (
                  <FontAwesome5Icon
                    name="exclamation-triangle"
                    size={20}
                    color="white"
                  />
                )}
                onPress={() => console.log("Report")}
                mode="contained"
                buttonColor="#f2b149"
              >
                Report
              </Button>
            </View>
          </View>

          {/* Right Section */}
          <View
            style={{
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={business.logo}
              style={{ width: 180, height: 180, borderRadius: 8 }}
              backgroundColor="white"
            />
            <Paragraph
              style={{ color: "white" }}
            >{`Open hours: ${business.openingTime} to ${business.closingTime}`}</Paragraph>
          </View>
        </View>
      </LinearGradient>

      {/* Bottom Section - To be implemented later */}
    </View>
  );
};

export default BusinessDetailsScreen;
