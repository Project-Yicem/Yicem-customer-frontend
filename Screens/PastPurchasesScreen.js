// PastPurchasesScreen.js
import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import {
  Card,
  Text,
  Button,
  Portal,
  Modal,
  TextInput,
  Appbar,
} from "react-native-paper";
import recentPurchases from "../DataFiles/recentPurchases.js"; // Import the past purchases data

const PastPurchasesScreen = ({ navigation }) => {
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const handleLeaveReview = () => {
    setReviewModalVisible(true);
  };
  const handleSubmitReview = () => {
    console.log("Review submitted:", reviewText);
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
                          numberOfLines={8} // Adjust the number of lines
                          maxLength={240} // Set the character limit
                          value={reviewText}
                          onChangeText={(text) => setReviewText(text)}
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
    </View>
  );
};

export default PastPurchasesScreen;
