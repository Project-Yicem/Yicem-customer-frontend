import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import {
  Button,
  Text,
  Title,
  Card,
  Icon,
  IconButton,
  Modal,
  Portal,
  TextInput,
  ActivityIndicator,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [isChangePasswordModalVisible, setChangePasswordModalVisible] =
    useState(false);
  const [isHelpModalVisible, setHelpModalVisible] = useState(false);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleChangePassword = () => {
    setChangePasswordModalVisible(false);
  };
  const handleHelpClose = () => {
    setHelpModalVisible(false);
  };

  const fetchRecentPurchases = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:3000/recent-purchases");
      return response.data;
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

  const buttonTexts = [
    "Favorite Businesses",
    "Change Password",
    "Help",
    "Logout",
  ];
  const iconSources = ["heart", "lock-reset", "help", "logout"];

  const handleLeaveReview = () => {
    setReviewModalVisible(true);
  };

  const handleViewAllPurchases = () => {
    navigation.navigate("PastPurchases");
  };

  const handleSubmitReview = () => {
    console.log("Review submitted:", reviewText);
    setReviewModalVisible(false);
  };

  const handleCardPressed = async (buttonText) => {
    switch (buttonText) {
      case "Favorite Businesses":
        navigation.navigate("FavoriteBusinesses");
        break;
      case "Change Password":
        setChangePasswordModalVisible(true);
        break;
      case "Help":
        setHelpModalVisible(true);
        break;
      case "Logout":
        await SecureStore.deleteItemAsync("userToken");
        navigation.navigate("Login");
        break;
      default:
        break;
    }
  };

  return (
    <ScrollView>
      <LinearGradient
        colors={["#f25e35", "#ff9c6b"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 16,
            marginTop: 24,
          }}
        >
          <Card
            style={{
              marginBottom: "5px",
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
              <Text variant="titleLarge" style={{ marginTop: 12 }}>
                {name}
              </Text>
              <IconButton
                icon="rename-box"
                iconColor="#A9A9A9"
                size={25}
                onPress={() => console.log("Pressed")}
              />
            </Card.Content>
          </Card>
          <Card
            style={{
              marginBottom: "10px",
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
              <Text variant="titleMedium" style={{ marginTop: 12 }}>
                {email}
              </Text>
              <IconButton
                icon="rename-box"
                iconColor="#A9A9A9"
                size={25}
                onPress={() => console.log("Pressed")}
              />
            </Card.Content>
          </Card>
        </View>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 16,
            marginTop: 2,
          }}
        >
          <Title style={{ color: "white" }}>Recent Purchases:</Title>
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
              {isLoading ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator
                    animating={true}
                    color="#f2b149"
                    size="large"
                  />
                </View>
              ) : recentPurchases.length > 0 ? (
                <>
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text variant="titleLarge">
                      {recentPurchases[0].cafeName}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ marginTop: 7 }} variant="bodyLarge">
                        {recentPurchases[0].itemTitle}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ color: "gray" }}>
                        {recentPurchases[0].date}
                      </Text>
                      <Text style={{ marginLeft: 10, color: "gray" }}>
                        {recentPurchases[0].price}
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
                </>
              ) : (
                <Text>No recent purchases found.</Text>
              )}
            </Card.Content>
          </Card>
          <Button
            title="View All Past Purchases"
            mode="text"
            buttonColor="white"
            onPress={handleViewAllPurchases}
          >
            {" "}
            View All Past Purchases{" "}
          </Button>
        </View>
      </LinearGradient>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 16,
          marginTop: 8,
        }}
      >
        {buttonTexts.map((buttonText, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              handleCardPressed(buttonText);
            }}
          >
            <Card
              mode="outlined"
              style={{
                marginBottom: 8,
                borderColor: "#f2b149",
                borderWidth: 1,
                borderRadius: 8,
              }}
            >
              <Card.Content
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}
              >
                <Icon
                  source={iconSources[index]}
                  color="#f25e35"
                  size={20}
                  style={{ marginRight: 8 }}
                />
                <Text>{buttonText}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
      {/* Change Password Modal */}
      <Portal>
        <Modal
          visible={isChangePasswordModalVisible}
          onDismiss={() => setChangePasswordModalVisible(false)}
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
              label="New Password"
              secureTextEntry
              style={{ marginBottom: 16 }}
            />
            <TextInput
              label="Confirm Password"
              secureTextEntry
              style={{ marginBottom: 16 }}
            />
            <Button mode="contained" onPress={handleChangePassword}>
              Change Password
            </Button>
          </View>
        </Modal>
      </Portal>
      {/* "Help" Modal */}
      <Portal>
        <Modal visible={isHelpModalVisible} onDismiss={handleHelpClose}>
          <View
            style={{
              backgroundColor: "white",
              padding: 16,
              borderRadius: 8,
              margin: 16,
              flexDirection: "column",
              justifyContent: "space-between",
              height: 200,
            }}
          >
            <Text variant="titleLarge">Contact Us:</Text>
            <Text>Email: support@example.com</Text>
            <Text>Phone: +1 123-456-7890</Text>
            <Button mode="contained" onPress={handleHelpClose}>
              Close
            </Button>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

export default ProfileScreen;
