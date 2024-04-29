import React, { useEffect, useState } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import {
  Searchbar,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Button,
} from "react-native-paper";
import styles, { theme } from "../Styles/styles";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import axios from "axios";
import businessesData from "../DataFiles/businessesData.js";
import { IP_ADDRESS } from "../Functions/GetIP.js";

const BusinessesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [isBusinessesLoading, setIsBusinessesLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBusinesses = async () => {
    try {
      setIsBusinessesLoading(true);
      const apiUrl = `http://${IP_ADDRESS}:8080/api/buyer/view-businesses`;
      const response = await axios.get(apiUrl);
      console.log("Businesses data fetched in BusinessesScreen");
      setIsBusinessesLoading(false);

      /* const updatedBusinesses = response.data.map((business) => {
        const currentTime = new Date().getHours();
        const openingTime = parseInt(business.openingHour.split(":")[0]);
        const closingTime = parseInt(business.closingHour.split(":")[0]);
        business.isOpen =
          currentTime >= openingTime && currentTime < closingTime;

        return business;
      }); */
      setBusinesses(orderBusinesses(response.data));
    } catch (error) {
      console.error("Error fetching businesses data:", error);
      setIsBusinessesLoading(false);
    }
  };

  const orderBusinesses = (businesses) => {
    // Order the businesses so that the open ones with available offers are shown first,
    //open ones with no offers are shown later, and closed ones are shown last
    const openBusinessesWithOffers = businesses.filter(
      (business) =>
        business.open && business.offers && business.offers.length > 0
    );
    const openBusinessesWithoutOffers = businesses.filter(
      (business) =>
        business.open && (!business.offers || business.offers.length === 0)
    );
    const closedBusinesses = businesses.filter((business) => !business.open);

    return openBusinessesWithOffers.concat(
      openBusinessesWithoutOffers.concat(closedBusinesses)
    );
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredBusinesses(businesses);
      return;
    }
    setFilteredBusinesses(
      businesses.filter((business) =>
        business.businessName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [businesses, searchQuery]);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#ff8069", "rgba(0,0,0,0)"]}
        locations={[0, 0.5]} // Adjust the values based on your preference
      >
        <Searchbar
          placeholder="Search for businesses..."
          onChangeText={(query) => setSearchQuery(query)}
          value={searchQuery}
          style={styles.searchBar}
        />
      </LinearGradient>
      {isBusinessesLoading && (
        <ActivityIndicator
          animating={true}
          color={theme.colors.primary}
          style={{ marginTop: "20%" }}
        />
      )}
      {!isBusinessesLoading && (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchBusinesses()}
            />
          }
        >
          {filteredBusinesses.map((business) => (
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
                    business.open
                      ? business.offers && business.offers.length > 0
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
                        {business.open
                          ? business.offers && business.offers.length > 0
                            ? "Open"
                            : "No offers available right now"
                          : "Closed: Opens at " + business.openingHour}
                      </Paragraph>
                    </View>
                    {/* Use splash.png if business logo is not available */}
                    <Card.Cover
                      source={
                        business.logo
                          ? (source = { uri: business.logo })
                          : require("../assets/splash.png")
                      }
                      style={{ width: 50, height: 50 }}
                    />
                  </Card.Content>
                </LinearGradient>
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default BusinessesScreen;
