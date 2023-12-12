import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { Searchbar, Card, Title, Paragraph } from "react-native-paper";
import styles, { theme } from "../Styles/styles";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";

const businessesData = [
  {
    id: 1,
    name: "Velocity Cafe",
    logo: require("../assets/businesslogos/logo_bakery.png"),
    isOpen: true,
    availableOffers: true,
    openingTime: "10:00",
    closingTime: "20:00",
  },
  {
    id: 2,
    name: "Beethoven Cafe",
    logo: require("../assets/businesslogos/logo_coffee.png"),
    isOpen: true,
    availableOffers: true,
    openingTime: "10:00",
    closingTime: "20:00",
  },
  {
    id: 3,
    name: "Cafe Fiery",
    logo: require("../assets/businesslogos/logo_F.jpeg"),
    isOpen: true,
    availableOffers: true,
    openingTime: "10:00",
    closingTime: "20:00",
  },
  {
    id: 4,
    name: "Rooftop Restaurant",
    logo: require("../assets/businesslogos/logo_salad.png"),
    isOpen: true,
    availableOffers: false,
    openingTime: "10:00",
    closingTime: "20:00",
  },
  {
    id: 5,
    name: "Tea Break",
    logo: require("../assets/businesslogos/logo_tea.jpeg"),
    isOpen: false,
    availableOffers: true,
    openingTime: "10:00",
    closingTime: "20:00",
  },
];

const BusinessesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBusinesses = businessesData.filter((business) =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View>
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
                      ? ["#f23545", "#ff9c6b"] // Open with offers: red to orange gradient
                      : ["rgba(242,53,69,0.4)", "rgba(255,156,107,0.4)"] // Open without offers: semi-transparent red to orange gradient
                    : ["#808080", "#ffffff"] // Closed: gray to white gradient
                }
                start={{ x: 0, y: 0.5 }} // left-to-right
                end={{ x: 1, y: 0.5 }} // left-to-right
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
