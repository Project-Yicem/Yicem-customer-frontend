import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import {
  Card,
  Text,
  Button,
  Portal,
  Modal,
  TextInput,
  Appbar,
  ActivityIndicator,
} from "react-native-paper";
import { AirbnbRating } from "react-native-ratings";
import axios from "axios";

const PastPurchasesScreen = ({ navigation }) => {
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0); // State for the star rating
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecentPurchases = async () => {
    try {
      // todo
      return [];
    } catch (error) {
      console.error("Error fetching businesses data:", error);
      throw error; // Rethrow the error to be handled by the caller
    }
  };

  useEffect(() => {
    const loadRecentPurchases = async () => {
      try {
        setTimeout(async () => {
          const allRecentPurchases = await fetchRecentPurchases();
          setRecentPurchases(allRecentPurchases);
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        console.error("Failed to load recent purchases:", error);
      }
    };

    loadRecentPurchases();
  }, []);

  const handleLeaveReview = () => {
    setReviewModalVisible(true);
  };

  const handleSubmitReview = () => {
    console.log("Review submitted:", reviewText);
    console.log("Rating submitted:", rating);
    setReviewModalVisible(false);
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
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator animating={true} color="#f2b149" size="large" />
        </View>
      ) : recentPurchases.length > 0 ? (
        <ScrollView>
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
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Text variant="titleLarge">{purchase.cafeName}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ marginTop: 7 }} variant="bodyLarge">
                      {purchase.itemTitle}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: "gray" }}>{purchase.date}</Text>
                    <Text style={{ marginLeft: 10, color: "gray" }}>
                      {purchase.price}
                    </Text>
                    <Portal>
                      <Modal
                        visible={isReviewModalVisible}
                        onDismiss={() => setReviewModalVisible(false)}
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
                          >
                            Submit Review
                          </Button>
                        </View>
                      </Modal>
                    </Portal>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    style={{ marginLeft: 20 }}
                    mode="contained"
                    title="Leave a Review"
                    compact="true"
                    onPress={handleLeaveReview}
                  >
                    Leave a Review
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text variant="titleLarge">No recent purchases</Text>
        </View>
      )}
    </View>
  );
};

export default PastPurchasesScreen;
