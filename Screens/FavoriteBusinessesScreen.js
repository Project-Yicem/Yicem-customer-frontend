import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { Searchbar, Card, Title, Paragraph, Appbar } from "react-native-paper";
import styles, { theme } from "../Styles/styles.js";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";

import businessesData from "../DataFiles/businessesData.js";

const FavoriteBusinessesScreen = ({ navigation }) => {
  const businesses = businessesData;

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: "#f25e35" }}>
        <Appbar.Action
          icon="arrow-left"
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content title="Your Favorites" color="white" />
      </Appbar.Header>

      <ScrollView>
        {businesses.map((business) => (
          <TouchableOpacity
            key={business.id}
            onPress={() =>
              navigation.navigate("BusinessDetailsScreen", { business })
            }
          >
            <Card
              mode="contained"
              key={business.id}
              style={styles.businessCard}
            >
              <LinearGradient
                colors={
                  business.isOpen
                    ? business.availableOffers
                      ? ["#f23545", "#ff9c6b"]
                      : ["rgba(242,53,69,0.4)", "rgba(255,156,107,0.4)"]
                    : ["#808080", "#ffffff"]
                }
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ borderRadius: 8, padding: 6 }}
              >
                <Card.Content
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <View style={{ flex: 1 }}>
                    <Title style={{ color: "white" }}>{business.name}</Title>
                    <Paragraph style={{ color: "white" }}>
                      {business.isOpen
                        ? business.availableOffers
                          ? "Open"
                          : "No offers available right now"
                        : "Closed: Opens at " + business.openingTime}
                    </Paragraph>
                  </View>
                  <Card.Cover
                    source={business.logo}
                    style={{ width: 50, height: 50 }}
                  />
                </Card.Content>
              </LinearGradient>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default FavoriteBusinessesScreen;
