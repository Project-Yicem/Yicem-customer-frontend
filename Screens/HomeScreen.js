import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from "react-native";
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import styles, { theme } from "../Styles/styles";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import axios from "axios";
import businessesData from "../DataFiles/businessesData.js";
import { IP_ADDRESS } from "../Functions/GetIP.js";
import * as SecureStore from "expo-secure-store";

const HomeScreen = ({ navigation }) => {
  const [businesses, setBusinesses] = useState([]);
  const [activeReservations, setActiveReservations] = useState([]);
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true);
  const [isLoadingActiveReservations, setIsLoadingActiveReservations] =
    useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reservationCanceling, setReservationCanceling] = useState(false);

  const fetchBusinesses = async () => {
    try {
      setIsLoadingBusinesses(true);
      const apiUrl = `http://${IP_ADDRESS}:8080/api/buyer/view-businesses`;
      const response = await axios.get(apiUrl);
      console.log("Businesses data fetched in Home screen");

      // TODO This is temporary!!! This should be handled by the backend
      /*       const updatedBusinesses = response.data.map((business) => {
        const currentTime = new Date().getHours();
        const openingTime = parseInt(business.openingHour.split(":")[0]);
        const closingTime = parseInt(business.closingHour.split(":")[0]);
        business.isOpen =
          currentTime >= openingTime && currentTime < closingTime;

        return business;
      });
 */
      // Filter the businesses so that only open businesses with available offers are shown
      const filteredBusinesses = response.data.filter(
        (business) =>
          business.open && business.offers && business.offers.length > 0
      );
      setBusinesses(filteredBusinesses);
      setIsLoadingBusinesses(false);
    } catch (error) {
      console.error("Error fetching businesses data:", error);
      setIsLoadingBusinesses(false);
    }
  };

  const fetchActiveReservations = async () => {
    setIsLoadingActiveReservations(true);
    const userToken = await SecureStore.getItemAsync("userToken");
    const apiUrl = `http://${IP_ADDRESS}:8080/api/buyer/reservations`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log(
        "Active reservations data fetched in Home screen",
        response.data
      );
      setActiveReservations(response.data);
      setIsLoadingActiveReservations(false);
      return [];
    } catch (error) {
      console.error("Error fetching active reservations data:", error);
    }
  };

  const cancelReservation = async (reservationId) => {
    setReservationCanceling(true);
    const userToken = await SecureStore.getItemAsync("userToken");
    const apiUrl = `http://${IP_ADDRESS}:8080/api/buyer/cancel/${reservationId}`;

    try {
      await axios.post(apiUrl, null, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log("Reservation cancelled successfully");
      setReservationCanceling(false);
      fetchActiveReservations();
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      setReservationCanceling(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
    fetchActiveReservations();
  }, []);

  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            fetchBusinesses();
            fetchActiveReservations();
          }}
        />
      }
    >
      <LinearGradient
        colors={["#ff8069", "rgba(0,0,0,0)"]}
        locations={[0, 0.5]} // Adjust the values based on your preference
      >
        <Text
          style={{ marginTop: "10%", marginLeft: "5%" }}
          variant="headlineSmall"
        >
          Your active reservations
        </Text>
      </LinearGradient>
      {isLoadingActiveReservations ? (
        <ActivityIndicator animating={true} color={theme.colors.primary} />
      ) : activeReservations.length === 0 ? (
        <Card mode="contained" style={styles.businessCard}>
          <Text style={{ padding: 20, fontStyle: "italic" }}>
            You have no active reservations right now.
          </Text>
        </Card>
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
                    <Title style={{ color: "#fff5b8" }}>
                      {item.sellerName}
                    </Title>
                    <Text style={{ color: "white" }}>{item.offerName}</Text>
                    {/**Display price and pickup time in the same row */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginVertical: 10,
                      }}
                    >
                      <Text style={{ color: "white" }}>
                        Price: ₺{item.offerPrice}
                      </Text>
                      <Text style={{ color: "white" }}>
                        Pickup time: {item.timeslot}
                      </Text>
                    </View>
                    {reservationCanceling ? (
                      <ActivityIndicator
                        animating={true}
                        color={theme.colors.primary}
                      />
                    ) : (
                      <Button
                        onPress={() => cancelReservation(item.id)}
                        textColor="#ffda6b"
                        mode="text"
                      >
                        Cancel Reservation
                      </Button>
                    )}
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
      <Text style={{ marginLeft: "5%" }} variant="headlineSmall">
        Available offers right now
      </Text>
      <ScrollView>
        {isLoadingBusinesses ? (
          <ActivityIndicator animating={true} color={theme.colors.primary} />
        ) : businesses.length === 0 ? (
          <Text style={{ margin: "5%" }}>
            No businesses found with available offers
          </Text>
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
                    business.open
                      ? business.offers && business.offers.length > 0
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
          ))
        )}
      </ScrollView>
    </ScrollView>
  );
};

export default HomeScreen;
