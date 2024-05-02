import React, { useEffect, useState } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import {
  Card,
  Text,
  Button,
  Portal,
  Modal,
  TextInput,
  Appbar,
  ActivityIndicator,
  Snackbar,
} from "react-native-paper";
import { AirbnbRating } from "react-native-ratings";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { IP_ADDRESS } from "../Functions/GetIP";

const PastPurchasesScreen = ({ navigation }) => {
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewTransactionId, setReviewTransactionId] = useState("");
  const [rating, setRating] = useState(0); // State for the star rating
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [isPurchasesLoading, setIsPurchasesLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isSendingReview, setIsSendingReview] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const fetchRecentPurchases = async () => {
    setIsPurchasesLoading(true);
    const apiUrl = `http://${IP_ADDRESS}:8080/api/buyer/purchases`;
    const userToken = await SecureStore.getItemAsync("userToken");

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      setRecentPurchases(response.data);

      // Sort purchases by date, latest first
      response.data.sort((a, b) => {
        return new Date(b.transactionDate) - new Date(a.transactionDate);
      });

      // Format all time objects to be more readable
      setRecentPurchases(
        response.data.map((purchase) => {
          const transactionDate = new Date(purchase.transactionDate);
          const formattedDate = `${transactionDate.getDate()}/${
            transactionDate.getMonth() + 1
          }/${transactionDate.getFullYear()} - ${
            transactionDate.getHours() < 10
              ? "0" + transactionDate.getHours()
              : transactionDate.getHours()
          }:${
            transactionDate.getMinutes() < 10
              ? "0" + transactionDate.getMinutes()
              : transactionDate.getMinutes()
          }`;
          return { ...purchase, transactionDate: formattedDate };
        })
      );

      setIsPurchasesLoading(false);
    } catch (error) {
      setIsPurchasesLoading(false);
      console.error("Error fetching businesses data:", error);
    }
  };

  useEffect(() => {
    fetchRecentPurchases();
  }, []);

  const handleSubmitReview = async () => {
    console.log("Submitting review", reviewText, rating, reviewTransactionId);

    if (rating === 0) {
      alert("Please select a rating");
      return;
    } else if (reviewText === "") {
      alert("Please write a review");
      return;
    }

    const apiUrl = `http://${IP_ADDRESS}:8080/api/buyer/review/${reviewTransactionId}`;
    const userToken = await SecureStore.getItemAsync("userToken");
    setIsSendingReview(true);

    try {
      const response = await axios.post(
        apiUrl,
        {
          comment: reviewText,
          rating: rating,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log("Review submitted successfully", response.data);
      setSnackbarVisible(true);
    } catch (error) {
      console.error("Error submitting review:", error);
    }

    setIsSendingReview(false);

    setReviewModalVisible(false);
    setReviewText("");
    setRating(0);
    setReviewTransactionId("");
    fetchRecentPurchases();
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: "#f25e35" }}>
        <Appbar.Action
          icon="arrow-left"
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content title="Past Purchases" color="white" />
      </Appbar.Header>
      {isPurchasesLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator animating={true} color="#f2b149" size="large" />
        </View>
      ) : recentPurchases.length > 0 ? (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchRecentPurchases();
                setRefreshing(false);
              }}
            />
          }
        >
          {recentPurchases.map((purchase, index) => (
            <Card
              key={index}
              mode="outlined"
              style={{
                margin: 12,
                borderColor: "#f2b149",
                borderWidth: 1,
                borderRadius: 8,
              }}
            >
              <Card.Content
                style={{
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Text variant="titleLarge">{purchase.sellerName}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {purchase.offerName ? (
                      <Text style={{ marginTop: 7 }} variant="bodyLarge">
                        {purchase.offerName}
                      </Text>
                    ) : (
                      <Text
                        style={{ marginTop: 7, fontStyle: "italic" }}
                        variant="bodyLarge"
                      >
                        offer no longer available
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: "gray" }}>
                      {purchase.transactionDate}
                    </Text>
                    <Text style={{ marginLeft: 10, color: "gray" }}>
                      ₺{purchase.price}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Button
                      mode="contained"
                      onPress={() =>
                        setReviewModalVisible(true) &
                        setReviewTransactionId(purchase.id)
                      }
                      style={{ marginTop: 16 }}
                      disabled={purchase.review && purchase.review != ""}
                    >
                      {!purchase.review || purchase.review === ""
                        ? "Leave a Review"
                        : "Review Submitted"}
                    </Button>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
          <Portal>
            <Modal
              visible={isReviewModalVisible}
              onDismiss={() => {
                setReviewModalVisible(false);
                setReviewText("");
                setRating(0);
                setReviewTransactionId("");
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 16,
                  borderRadius: 8,
                  margin: 16,
                }}
              >
                <TextInput
                  label="Write your review"
                  multiline
                  numberOfLines={6} // Adjust the number of lines
                  maxLength={240} // Set the character limit
                  value={reviewText}
                  onChangeText={(text) => setReviewText(text)}
                />
                <AirbnbRating
                  count={5}
                  defaultRating={0}
                  size={24}
                  showRating={false}
                  onFinishRating={(value) => setRating(value)}
                  style={{ marginTop: 16 }}
                />
                <Button
                  mode="contained"
                  onPress={handleSubmitReview}
                  style={{ marginTop: 16 }}
                  disabled={isSendingReview}
                >
                  {isSendingReview ? (
                    <ActivityIndicator animating={true} color="#f2b149" />
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </View>
            </Modal>
          </Portal>
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text variant="titleLarge">You have no purchases yet.</Text>
        </View>
      )}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        onIconPress={() => setSnackbarVisible(false)}
      >
        <Text style={{ color: "white" }}>Review submitted successfully</Text>
      </Snackbar>
    </View>
  );
};

export default PastPurchasesScreen;
