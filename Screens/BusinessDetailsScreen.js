import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, ScrollView } from "react-native";
import {
  Text,
  Title,
  IconButton,
  Paragraph,
  Button,
  Card,
  Modal,
  Portal,
  RadioButton,
  Dialog,
  TextInput,
  ActivityIndicator,
} from "react-native-paper";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import { IP_ADDRESS } from "../Functions/GetIP";
import * as SecureStore from "expo-secure-store";

const BusinessDetailsScreen = ({ navigation, route }) => {
  const containerStyle = { backgroundColor: "white", padding: 20 };
  const { business } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [checked, setChecked] = useState("");
  const [reportText, setReportText] = useState("");
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [offers, setOffers] = useState();
  const [isOffersLoading, setIsOffersLoading] = useState(false);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const showDialog = () => {
    setDialogVisible(true);
    hideModal();
  };
  const hideDialog = () => setDialogVisible(false);

  const handleReport = () => {
    // Logic for handling the report button press
    // For now, just log a message to the console
    console.log("Report button pressed");
    // You can show the modal for reporting here
    setReportModalVisible(true);
  };

  const navigateToReviews = () => {
    navigation.navigate("Reviews", { business });
  };

  const isBusinessInFavorites = async () => {
    setIsFavoriteLoading(true);
    const apiUrl = `http://${IP_ADDRESS}:8080/api/buyer/favorites`;
    // Include user token in the request headers
    const userToken = await SecureStore.getItemAsync("userToken");
    const headers = {
      Authorization: `Bearer ${userToken}`,
    };
    try {
      const response = await axios.get(apiUrl, { headers });
      const favoriteBusinesses = response.data;
      if (favoriteBusinesses.length === 0) {
        console.log("No favorite businesses found");
        setIsFavoriteLoading(false);
        return false;
      }
      setIsFavoriteLoading(false);
      return favoriteBusinesses.some(
        (favoriteBusiness) => favoriteBusiness.id === business.id
      );
    } catch (error) {
      console.error("Error fetching favorite businesses:", error);
      return false;
    }
  };

  const fetchOffers = async () => {
    if (!business.currentOffers) {
      setOffers([]);
      return;
    }
    setIsOffersLoading(true);
    // Include user token in the request headers
    const userToken = await SecureStore.getItemAsync("userToken");
    const headers = {
      Authorization: `Bearer ${userToken}`,
    };
    try {
      const apiUrl = `http://${IP_ADDRESS}:8080/api/buyer/business/${business.id}/offers`;
      const response = await axios.get(apiUrl, { headers });
      setOffers(response.data);
      console.log("Offers data fetched in BusinessDetailsScreen");
      setIsOffersLoading(false);
    } catch (error) {
      console.error("Error fetching offers data:", error);
      setIsOffersLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      fetchOffers();
      const favorite = await isBusinessInFavorites();
      setIsFavorite(favorite);
    };

    fetchData();
  }, []);

  const addBusinessToFavorites = async (businessId) => {
    const apiUrl = `http://${IP_ADDRESS}:8080/api/buyer/favorite/${businessId}`;
    // Include user token in the request headers
    const userToken = await SecureStore.getItemAsync("userToken");
    const headers = {
      Authorization: `Bearer ${userToken}`,
    };
    try {
      if (isFavorite) {
        // Remove business from favorites
        // TODO implement this when the un-favorite API is handled on the backend
      } else {
        // Add business to favorites
        await axios.post(apiUrl, null, { headers });
        setIsFavorite(true);
        console.log("Business added to favorites");
      }
    } catch (error) {
      console.error("Error adding/removing business from favorites:", error);
    }
  };

  return (
    <ScrollView>
      <LinearGradient
        colors={
          business.isOpen ? ["#f25e35", "#ff9c6b"] : ["#808080", "#cacaca"]
        }
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ margin: 8, marginTop: 40, zIndex: 1 }}
        >
          <FontAwesome5Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 16,
            marginTop: 8,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: "white" }} variant="headlineMedium">
              {business.businessName}
            </Text>
            <Paragraph style={{ color: "white" }}>
              Open hours: {business.openingHour} - {business.closingHour}
            </Paragraph>
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
                {business.rating ? business.rating : "No ratings yet"}
              </Paragraph>
              <Button
                mode="text"
                compact
                textColor="#ffe6a3"
                onPress={navigateToReviews}
              >
                View Reviews
              </Button>
            </View>
          </View>
          <View style={{ flexDirection: "column" }}>
            <Image
              source={
                business.logo ? business.logo : require("../assets/splash.png")
              }
              style={{
                width: 100,
                height: 100,
                borderRadius: 8,
              }}
              backgroundColor="white"
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: 4, padding: 10 }}>
          <View style={{ flex: 1, marginBottom: 8 }}>
            {isFavoriteLoading ? (
              <ActivityIndicator animating={true} color="#f2b149" />
            ) : (
              <Button
                icon={() => (
                  <FontAwesome5Icon
                    name="heart"
                    size={20}
                    style={{ marginRight: 4, color: "white" }}
                  />
                )}
                mode="contained"
                buttonColor={isFavorite ? "#ffa099" : "#f23545"}
                onPress={() => {
                  addBusinessToFavorites(business.id);
                }}
              >
                {isFavorite ? (
                  <Text style={{ color: "white" }}>Remove Favorite</Text>
                ) : (
                  <Text style={{ color: "white" }}>Add to Favorites</Text>
                )}
              </Button>
            )}
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Button
              icon={() => (
                <FontAwesome5Icon
                  name="exclamation-triangle"
                  size={20}
                  color="white"
                />
              )}
              onPress={handleReport}
              mode="contained"
              buttonColor="#f2b149"
            >
              <Text style={{ color: "white" }}>Report</Text>
            </Button>
          </View>
        </View>
      </LinearGradient>
      <View style={{ padding: 16 }}>
        <Portal>
          <Modal
            visible={reportModalVisible}
            onDismiss={() => {
              setReportModalVisible(false);
              setReportText("");
            }}
            contentContainerStyle={containerStyle}
          >
            <Title>Report Business</Title>
            <Paragraph>
              Did you have any problems with this place? Let us know!
            </Paragraph>
            <TextInput
              label="Report Details"
              value={reportText}
              multiline
              numberOfLines={4} // You can adjust the number of lines as needed
              onChangeText={(text) => setReportText(text)}
              style={{ marginBottom: 16 }}
            />
            <Button
              mode="contained"
              onPress={() => {
                setReportModalVisible(false);
              }}
            >
              Submit Report
            </Button>
          </Modal>
        </Portal>
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}
          >
            <Title>Choose A Time To Pick Up The Box</Title>
            <View style={{ flexDirection: "row" }}>
              <RadioButton
                value="first"
                status={checked === "first" ? "checked" : "unchecked"}
                onPress={() => setChecked("first")}
              />
              <Text style={{ marginTop: 10 }}> 17:00-17.30 </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <RadioButton
                value="second"
                status={checked === "second" ? "checked" : "unchecked"}
                onPress={() => setChecked("second")}
              />
              <Text style={{ marginTop: 10 }}> 17:30-18:00 </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <RadioButton
                value="third"
                status={checked === "third" ? "checked" : "unchecked"}
                onPress={() => setChecked("third")}
              />
              <Text style={{ marginTop: 10 }}> 18:30-19:00 </Text>
            </View>
            <Button mode="contained" onPress={showDialog}>
              Make A Reservation
            </Button>
          </Modal>
        </Portal>
        <Portal>
          <Dialog visible={dialogVisible} onDismiss={hideDialog}>
            <Dialog.Content>
              <Title>Reservation Successful</Title>
              <Paragraph>
                You can pick up your box between 17:30-18:00.
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Title>Available Offers</Title>
        {isOffersLoading && (
          <ActivityIndicator
            animating={true}
            color="#f2b149"
            style={{ marginTop: 20 }}
          />
        )}
        {!isOffersLoading &&
          (business.isOpen ? (
            Array.isArray(offers) && offers.length > 0 ? (
              offers.map((offer, index) => {
                return offer.itemCount > 0 ? (
                  <TouchableOpacity key={index} onPress={showModal}>
                    <Card
                      mode="outlined"
                      style={{
                        marginBottom: 12,
                        borderColor: "#f2b149",
                        borderWidth: 1,
                        borderRadius: 8,
                      }}
                    >
                      <Card.Content
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text>{offer.offerName}</Text>
                        <Text>₺{offer.price}</Text>
                      </Card.Content>
                      <Card.Content>
                        <Paragraph style={{ fontStyle: "italic" }}>
                          {offer.description}
                        </Paragraph>
                      </Card.Content>
                    </Card>
                  </TouchableOpacity>
                ) : null;
              })
            ) : (
              <Paragraph style={{ fontStyle: "italic" }}>
                No offers available right now.
              </Paragraph>
            )
          ) : (
            <Paragraph style={{ fontStyle: "italic" }}>
              Business is closed, come back later.
            </Paragraph>
          ))}
      </View>
    </ScrollView>
  );
};

export default BusinessDetailsScreen;
