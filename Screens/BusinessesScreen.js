import React, { useEffect, useState } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import {
  Searchbar,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
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

      // Add an arbitrary "isOpen" attribute to each business
      // TODO This is temporary!!! This should be handled by the backend
      const updatedBusinesses = response.data.map((business) => {
        business.isOpen = true;
        return business;
      });
      setBusinesses(updatedBusinesses);
    } catch (error) {
      console.error("Error fetching businesses data:", error);
      setIsBusinessesLoading(false);
    }
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
      )}
    </View>
  );
};

export default BusinessesScreen;
