import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Text, Card, Title, Paragraph, Button } from "react-native-paper";
import styles, { theme } from "../Styles/styles";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";

import businessesData from "../DataFiles/businessesData.js";

const HomeScreen = ({ navigation }) => {
  // Filter businesses based on distance
  const businesses = businessesData.filter(
    (business) => parseInt(business.distance) < 500
  );

  const [activeReservations, setActiveReservations] = useState([
    {
      id: 1,
      cafeName: "Cafe Velocity",
      itemTitle: "Box 1",
      price: "$4.50",
      pickupTime: "12:00 - 13.00 PM",
    },
    {
      id: 2,
      cafeName: "Beethoven Cafe",
      itemTitle: "Box 2",
      price: "$3.50",
      pickupTime: "1:00 - 2.00 PM",
    },
  ]);
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#ff8069", "rgba(0,0,0,0)"]}
        locations={[0, 0.5]} // Adjust the values based on your preference
      >
        <Text
          style={{ marginTop: "10%", marginLeft: "5%" }}
          variant="headlineMedium"
        >
          Your active reservations
        </Text>
      </LinearGradient>
      {activeReservations.length === 0 ? (
        <Text
          style={{ marginTop: "5%", marginLeft: "5%", fontStyle: "italic" }}
        >
          You have no active reservations right now
        </Text>
      ) : (
        <View>
          <>
            <Carousel
              layout="default"
              data={activeReservations}
              renderItem={({ item }) => (
                <Card
                  key={item.id}
                  style={styles.carouselCard}
                  mode="contained"
                >
                  <Card.Content>
                    <Title style={{ color: "white" }}>{item.cafeName}</Title>
                    <Paragraph style={{ color: "white" }}>
                      {item.itemTitle}
                    </Paragraph>
                    <Paragraph style={{ color: "white" }}>
                      Price: {item.price}
                    </Paragraph>
                    <Paragraph style={{ color: "white" }}>
                      Pickup time: {item.pickupTime}
                    </Paragraph>
                    <Button onPress={() => {}} textColor="#ffda6b" mode="text">
                      Cancel Reservation
                    </Button>
                  </Card.Content>
                </Card>
              )}
              sliderWidth={Dimensions.get("window").width}
              itemWidth={Dimensions.get("window").width}
              loop={false}
              autoplay={false}
              onSnapToItem={(index) => setActiveSlide(index)}
            />
            <Pagination
              dotsLength={activeReservations.length}
              activeDotIndex={activeSlide}
              containerStyle={{ paddingVertical: 10 }}
            />
          </>
        </View>
      )}
      <Text style={{ marginLeft: "5%" }} variant="headlineMedium">
        Offers Near You
      </Text>
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
                    <Text style={{ color: "white" }}>{business.distance}</Text>
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

export default HomeScreen;
