import React, { useState } from "react";
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
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import recentPurchases from "../DataFiles/recentPurchases.js";

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");

  const buttonTexts = [
    "Favorite Businesses",
    "Change Password",
    "Help",
    "Logout",
  ];
  const iconSources = ["heart", "lock-reset", "help", "logout"];

  const handleEditProfile = () => {
    // Handle edit profile logic here
  };

  const handleLeaveReview = () => {
    setReviewModalVisible(true);
  };

  const handleViewAllPurchases = () => {
    navigation.navigate("PastPurchases");
  };

  const handleFavoriteBusinesses = () => {
    // Handle favorite businesses logic here
  };

  const handleChangePassword = () => {
    // Handle change password logic here
  };

  const handleHelp = () => {
    // Handle help logic here
  };

  const handleLogout = () => {
    // Handle logout logic here
  };

  const handleSubmitReview = () => {
    console.log("Review submitted:", reviewText);
    setReviewModalVisible(false);
  };

  return (
    <ScrollView style={{ marginTop: 30 }}>
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
            marginTop: 8,
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
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Text variant="titleLarge">{recentPurchases[0].cafeName}</Text>
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
          <TouchableOpacity key={index}>
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
    </ScrollView>
  );
};

/*
<Button title="Favorite Businesses" onPress={handleFavoriteBusinesses} />
<Button title="Change Password" onPress={handleChangePassword} />
<Button title="Help" onPress={handleHelp} />
<Button title="Logout" onPress={handleLogout} />
*/

export default ProfileScreen;
