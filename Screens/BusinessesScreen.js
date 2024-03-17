import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { Searchbar, Card, Title, Paragraph } from "react-native-paper";
import styles, { theme } from "../Styles/styles";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";

import businessesData from "../DataFiles/businessesData.js";

const BusinessesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBusinesses = businessesData.filter((business) =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <ScrollView>
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

export default BusinessesScreen;
