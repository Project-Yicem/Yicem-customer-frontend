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
  Snackbar,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { IP_ADDRESS } from "../Functions/GetIP";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import ProfilePicturePicker from "../Components/ProfilePicturePicker";

const ProfileScreen = ({ navigation }) => {
  const [isChangePasswordModalVisible, setChangePasswordModalVisible] =
    useState(false);
  const [isHelpModalVisible, setHelpModalVisible] = useState(false);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [isRecentPurchasesLoading, setIsRecentPurchasesLoading] =
    useState(true);
  const [userData, setUserData] = useState({});
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [isUsernameEditable, setUsernameEditable] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [testImageUri, setTestImageUri] = useState("");

  const handleChangePassword = async (passwordState) => {
    console.log("Changing password with state:", passwordState);
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      alert(
        "Please make sure the new password and confirm password fields match."
      );
      return;
    }
    const userToken = await SecureStore.getItemAsync("userToken");
    const apiUrl = `http://${IP_ADDRESS}:8080/api/buyer/update-password`;
    const passwordData = {
      oldPassword: passwordState.currentPassword,
      newPassword: passwordState.newPassword,
    };
    axios
      .put(apiUrl, passwordData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Password updated successfully");
        setChangePasswordModalVisible(false);
        setPasswordUpdated(true);
      })
      .catch((error) => {
        alert(
          "Error updating password. Please try again and make sure your old password is correct."
        );
      });

    setChangePasswordModalVisible(false);
  };
  const handleHelpClose = () => {
    setHelpModalVisible(false);
  };

  const fetchRecentPurchases = async () => {
    try {
      setIsRecentPurchasesLoading(true);
      const userToken = await SecureStore.getItemAsync("userToken");
      const apiUrl = `http://${IP_ADDRESS}:8080/api/buyer/purchases`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log("Recent purchases data fetched in ProfileScreen");

      // Sort purchases by date, latest first
      response.data.sort((a, b) => {
        return new Date(b.transactionDate) - new Date(a.transactionDate);
      });

      // Format the dates and times to be more readable
      const formattedPurchases = response.data.map((purchase) => {
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
      });
      setRecentPurchases(formattedPurchases);

      setIsRecentPurchasesLoading(false);
    } catch (error) {
      console.error("Error fetching recent purchases data:", error);
      setIsRecentPurchasesLoading(false);
    }
  };

  const getUserData = async () => {
    setUserDataLoading(true);
    const userData = await SecureStore.getItemAsync("userInfo");
    console.log("User data:", userData);
    setUserData(JSON.parse(userData));
    setUserDataLoading(false);
  };

  const updateUsername = async (updatedUsername) => {
    const userToken = await SecureStore.getItemAsync("userToken");
    const apiUrl = `http://${IP_ADDRESS}:8080/api/buyer/update-username`;
    axios
      .put(apiUrl, updatedUsername, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "text/plain",
        },
      })
      .then((response) => {
        console.log("Username updated successfully");
        // Update the username in the secure storage too
        const newUserInfo = { ...userData, username: updatedUsername };
        SecureStore.setItemAsync("userInfo", JSON.stringify(newUserInfo));
        getUserData();
      })
      .catch((error) => {
        console.error("Error updating username:", error);
      });
  };

  useEffect(() => {
    getUserData();
    fetchRecentPurchases();
    const userToken = SecureStore.getItemAsync("userToken");
  }, []);

  const buttonTexts = [
    "Favorite Businesses",
    "Change Password",
    "Help",
    "Logout",
  ];
  const iconSources = ["heart", "lock-reset", "help", "logout"];

  const handleViewAllPurchases = () => {
    navigation.navigate("PastPurchases");
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
              {userDataLoading ? (
                <ActivityIndicator
                  animating={true}
                  color="#f2b149"
                  size="large"
                />
              ) : isUsernameEditable ? (
                <>
                  <TextInput
                    value={newUsername}
                    onChangeText={setNewUsername}
                    autoFocus={true}
                    style={{ flex: 1 }}
                  />
                  <IconButton
                    icon="content-save"
                    iconColor="#A9A9A9"
                    size={25}
                    onPress={() => {
                      setUsernameEditable(false);
                      console.log("Updating username to:", newUsername);
                      updateUsername(newUsername);
                    }}
                  />
                </>
              ) : (
                <>
                  <Text variant="titleLarge" style={{ marginTop: 12 }}>
                    {userData.username}
                  </Text>
                  <IconButton
                    icon="pencil"
                    iconColor="#A9A9A9"
                    size={25}
                    onPress={() => setUsernameEditable(true)}
                  />
                </>
              )}
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
              {userDataLoading ? (
                <ActivityIndicator
                  animating={true}
                  color="#f2b149"
                  size="large"
                />
              ) : (
                <Text variant="titleMedium" style={{ marginTop: 12 }}>
                  {userData.email}
                </Text>
              )}
              <IconButton size={25} />
              {/*Add an Icon here if we want to make this editable later*/}
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
          <Title style={{ color: "white" }}>Latest Purchase:</Title>
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
              {isRecentPurchasesLoading ? (
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
                      {recentPurchases[0].sellerName}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ marginTop: 7 }} variant="bodyLarge">
                        {recentPurchases[0].offerName}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ color: "gray" }}>
                        {recentPurchases[0].transactionDate}
                      </Text>
                      <Text style={{ marginLeft: 10, color: "gray" }}>
                        ₺{recentPurchases[0].price}
                      </Text>
                    </View>
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
            View All Past Purchases
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
        {/* Profile Picture Picker. Not used in this app, usage example:
        <ProfilePicturePicker
          profilePicture={testImageUri}
          setProfilePicture={setTestImageUri}
        />
      */}
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
              label="Current Password"
              secureTextEntry
              style={{ marginBottom: 16 }}
              onChangeText={(text) =>
                setPasswordState({ ...passwordState, currentPassword: text })
              }
            />
            <TextInput
              label="New Password"
              secureTextEntry
              style={{ marginBottom: 16 }}
              onChangeText={(text) =>
                setPasswordState({ ...passwordState, newPassword: text })
              }
            />
            <TextInput
              label="Confirm Password"
              secureTextEntry
              style={{ marginBottom: 16 }}
              onChangeText={(text) =>
                setPasswordState({ ...passwordState, confirmPassword: text })
              }
            />
            <Button
              mode="contained"
              onPress={() => handleChangePassword(passwordState)}
            >
              Change Password
            </Button>
          </View>
        </Modal>
      </Portal>
      {/* Password updated snackbar */}
      <Snackbar
        visible={passwordUpdated}
        onDismiss={() => setPasswordUpdated(false)}
        onIconPress={() => setPasswordUpdated(false)}
        duration={Snackbar.LENGTH_SHORT}
      >
        Your password has been updated successfully.
      </Snackbar>
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
