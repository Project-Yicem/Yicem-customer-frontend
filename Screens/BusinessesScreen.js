import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { Searchbar, Card, Title, Paragraph } from "react-native-paper";
import styles, { theme } from "../Styles/styles";

const businessesData = [
  {
    id: 1,
    name: "Restaurant 1",
    logo: require("../assets/businesslogos/logo_bakery.png"),
    isOpen: true,
  },
  {
    id: 2,
    name: "Restaurant 2",
    logo: require("../assets/businesslogos/logo_coffee.png"),
    isOpen: false,
  },
];

const BusinessesScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBusinesses = businessesData.filter((business) =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View>
      <Searchbar
        placeholder="Search for businesses..."
        onChangeText={(query) => setSearchQuery(query)}
        value={searchQuery}
      />
      <ScrollView>
        {filteredBusinesses.map((business) => (
          <Card mode="contained" key={business.id} style={{ margin: 16 }}>
            <Card.Content
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ flex: 1 }}>
                <Title>{business.name}</Title>
                <Paragraph>{business.isOpen ? "Open" : "Closed"}</Paragraph>
              </View>
              <Card.Cover
                source={business.logo}
                style={{ width: 50, height: 50 }}
              />
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

export default BusinessesScreen;
