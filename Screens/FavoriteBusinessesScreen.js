import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import {
  Searchbar,
  Card,
  Title,
  Paragraph,
  Appbar,
  ActivityIndicator,
  Text,
} from "react-native-paper";
import styles, { theme } from "../Styles/styles.js";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { IP_ADDRESS } from "../Functions/GetIP";

const FavoriteBusinessesScreen = ({ navigation }) => {
  const [businesses, setBusinesses] = useState([]);
  const [isBusinessesLoading, setIsBusinessesLoading] = useState(true);

  const fetchBusinesses = async () => {
    setIsBusinessesLoading(true);
    const userToken = await SecureStore.getItemAsync("userToken");
    const apiUrl = `http://${IP_ADDRESS}:8080/api/buyer/favorites`;
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        // TODO This is temporary!!! This should be handled by the backend
        if (!response.data) {
          setIsBusinessesLoading(false);
          console.log("No favorite businesses found");
          return;
        }
        const updatedBusinesses = response.data.map((business) => {
          // calculate if current system time is between opening and closing time
          const currentTime = new Date().getHours();
          const openingTime = parseInt(business.openingHour.split(":")[0]);
          const closingTime = parseInt(business.closingHour.split(":")[0]);
          business.isOpen =
            currentTime >= openingTime && currentTime < closingTime;
        });
        setBusinesses(updatedBusinesses);

        setBusinesses(response.data);
        setIsBusinessesLoading(false);
        console.log("Favorite businesses data fetched", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

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
        {isBusinessesLoading ? (
          <ActivityIndicator
            animating={true}
            color={theme.colors.primary}
            size="large"
            style={{ marginTop: 20 }}
          />
        ) : !businesses || businesses.length == 0 ? (
          <Card mode="contained" style={styles.businessCard}>
            <Title style={{ padding: 20 }}>No favorite businesses yet</Title>
            <Text style={{ padding: 20, fontStyle: "italic" }}>
              You can add businesses to your favorites from their business page.
            </Text>
          </Card>
        ) : (
          businesses.map((business) => (
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
                      ? business.currentOffers &&
                        business.currentOffers.length > 0
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
                      <Title style={{ color: "white" }}>
                        {business.businessName}
                      </Title>
                      <Paragraph style={{ color: "white" }}>
                        {business.isOpen
                          ? business.currentOffers &&
                            business.currentOffers.length > 0
                            ? "Open"
                            : "No offers available right now"
                          : "Closed: Opens at " + business.openingHour}
                      </Paragraph>
                    </View>
                    {/* Use splash.png if business logo is not available */}
                    <Card.Cover
                      source={
                        business.logo
                          ? business.logo
                          : require("../assets/splash.png")
                      }
                      style={{ width: 50, height: 50 }}
                    />
                  </Card.Content>
                </LinearGradient>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default FavoriteBusinessesScreen;
