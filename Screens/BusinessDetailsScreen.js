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
  Snackbar,
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
  const [reportText, setReportText] = useState("");
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [offers, setOffers] = useState();
  const [isOffersLoading, setIsOffersLoading] = useState(false);
  const [pickupTimesInModal, setPickupTimesInModal] = useState([]);
  const [offerIdInModal, setOfferIdInModal] = useState(null);
  const [reservationTime, setReservationTime] = useState(null);
  const [isMakeReservationLoading, setIsMakeReservationLoading] =
    useState(false);
  const [reportSendLoading, setReportSendLoading] = useState(false);
  const [reportSnackbarVisible, setReportSnackbarVisible] = useState(false);

  const showModal = (offerId, pickupTimes) => {
    console.log("Offer modal pressed for offerId: ", offerId);
    setPickupTimesInModal(pickupTimes);
    setOfferIdInModal(offerId);
    setModalVisible(true);
  };
  const hideModal = () => setModalVisible(false);

  const showDialog = () => {
    setDialogVisible(true);
    hideModal();
  };
  const hideDialog = () => setDialogVisible(false);

  const handleReport = async () => {
    if (reportText === "") {
      alert("Please enter a report description.");
      return;
    }
    console.log("Reporting:", reportText);
    setReportSendLoading(true);
    const apiUrl = `http://${IP_ADDRESS}:8080/api/buyer/business/${business.id}/report`;
    // Include user token in the request headers
    const userToken = await SecureStore.getItemAsync("userToken");
    const headers = {
      Authorization: `Bearer ${userToken}`,
    };
    const params = {
      reportDescription: reportText,
    };
    try {
      await axios.post(apiUrl, null, {
        params: params,
        headers: headers,
      });
      console.log("Report submitted successfully");
      setReportSendLoading(false);
    } catch (error) {
      console.error("Error submitting report:", error);
      setReportSendLoading(false);
      alert("Error submitting report. Please try again.");
    }
    setReportSnackbarVisible(true);
    setReportModalVisible(false);
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

  const makeReservation = async (time) => {
    setIsMakeReservationLoading(true);
    setReservationTime(`${time.pickupTimeStart} - ${time.pickupTimeEnd}`);
    console.log(
      "Making reservation for offer id",
      offerIdInModal,
      "at time",
      time.pickupTimeStart + "-" + time.pickupTimeEnd
    );

    const apiUrl = `http://${IP_ADDRESS}:8080/api/buyer/reserve/${offerIdInModal}`;
    const userToken = await SecureStore.getItemAsync("userToken");
    const headers = {
      Authorization: `Bearer ${userToken}`,
    };
    const queryParams = {
      timeSlot: time.pickupTimeStart + "-" + time.pickupTimeEnd,
    };

    try {
      await axios.post(apiUrl, null, { params: queryParams, headers: headers });
      console.log(
        "Reservation made successfully for offer id",
        offerIdInModal,
        "at time",
        time.pickupTimeStart + "-" + time.pickupTimeEnd
      );
      setIsMakeReservationLoading(false);
      showDialog();
    } catch (error) {
      // If error code is 409, alert that they've already made a res. for that time
      if (error.response.status === 409) {
        alert("You've already made a reservation for this offer.");
        setIsMakeReservationLoading(false);
      } else {
        console.error("Error making reservation:", error);
        alert("Error making reservation. Please try again.");
        setIsMakeReservationLoading(false);
      }
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

  const favOrUnfavBusiness = async (businessId) => {
    const apiUrlFav = `http://${IP_ADDRESS}:8080/api/buyer/favorite/${businessId}`;
    const apiUrlUnfav = `http://${IP_ADDRESS}:8080/api/buyer/unfavorite/${businessId}`;
    // Include user token in the request headers
    const userToken = await SecureStore.getItemAsync("userToken");
    const headers = {
      Authorization: `Bearer ${userToken}`,
    };
    try {
      if (isFavorite) {
        // Remove business from favorites
        await axios.post(apiUrlUnfav, null, { headers });
        setIsFavorite(false);
        console.log("Business removed from favorites");
      } else {
        // Add business to favorites
        await axios.post(apiUrlFav, null, { headers });
        setIsFavorite(true);
        console.log("Business added to favorites");
      }
    } catch (error) {
      console.error("Error adding/removing business from favorites:", error);
    }
  };

  const OfferReservationModal = ({
    pickupTimes,
    visible,
    onDismiss,
    onReservation,
  }) => {
    const [checkedTime, setCheckedTime] = useState("");

    const handleCheckboxChange = (time) => {
      setCheckedTime(time);
    };

    return (
      <Portal>
        <Modal
          visible={visible}
          onDismiss={onDismiss}
          contentContainerStyle={containerStyle}
        >
          <Title>Choose A Time To Pick Up The Box</Title>
          {pickupTimes.map((time, index) => (
            <View
              key={index}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <RadioButton
                value={time}
                status={checkedTime === time ? "checked" : "unchecked"}
                onPress={() => handleCheckboxChange(time)}
              />
              <Text>{`${time.pickupTimeStart}-${time.pickupTimeEnd}`}</Text>
            </View>
          ))}
          {isMakeReservationLoading ? (
            <ActivityIndicator animating={true} />
          ) : (
            <Button mode="contained" onPress={() => onReservation(checkedTime)}>
              Make A Reservation
            </Button>
          )}
        </Modal>
      </Portal>
    );
  };

  const ReservationSuccessDialog = ({
    reservationTime,
    visible,
    onDismiss,
  }) => {
    return (
      <Portal>
        <Dialog visible={visible} onDismiss={onDismiss}>
          <Dialog.Content>
            <Title>Reservation Successful</Title>
            <Paragraph>
              You can pick up your box between {reservationTime}.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onDismiss}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  return (
    <>
      <ScrollView>
        <LinearGradient
          colors={
            business.open ? ["#f25e35", "#ff9c6b"] : ["#808080", "#cacaca"]
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
                  business.logo
                    ? (source = { uri: business.logo })
                    : require("../assets/splash.png")
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
                    favOrUnfavBusiness(business.id);
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
                onPress={() => setReportModalVisible(true)}
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
                  handleReport();
                }}
              >
                Submit Report
              </Button>
            </Modal>
          </Portal>
          {/* Offer reservation modal */}
          <OfferReservationModal
            pickupTimes={pickupTimesInModal}
            visible={modalVisible}
            onDismiss={hideModal}
            onReservation={(time) => {
              makeReservation(time);
            }}
          />
          {/* Dialog for successful reservation */}
          <ReservationSuccessDialog
            reservationTime={reservationTime}
            visible={dialogVisible}
            onDismiss={hideDialog}
          />
          <Title>Available Offers</Title>
          {isOffersLoading && (
            <ActivityIndicator
              animating={true}
              color="#f2b149"
              style={{ marginTop: 20 }}
            />
          )}
          {!isOffersLoading &&
            (business.open ? (
              Array.isArray(offers) && offers.length > 0 ? (
                offers.map((offer, index) => {
                  return offer.itemCount > 0 ? (
                    <TouchableOpacity
                      key={index}
                      onPress={() => showModal(offer.id, offer.pickupTimes)}
                    >
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
      {/**Report sent snackbar */}
      <Snackbar
        visible={reportSnackbarVisible}
        onDismiss={() => setReportSnackbarVisible(false)}
        onIconPress={() => setReportSnackbarVisible(false)}
      >
        Your report has been sent. We will review your feedback about this
        establishment.
      </Snackbar>
    </>
  );
};

export default BusinessDetailsScreen;
