import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Button, Text, Title, Card, Icon, IconButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

const ProfileScreen = () => {
    const [name, setName] = useState("John Doe");
    const [email, setEmail] = useState("johndoe@example.com");
    const buttonTexts = [ "Favorite Businesses", "Change Password", "Help", "Logout"];
    const iconSources = [ "heart", "lock-reset", "help", "logout"]

    const handleEditProfile = () => {
        // Handle edit profile logic here
    };

    const handleLeaveReview = () => {
        // Handle leave review logic here
    };

    const handleViewAllPurchases = () => {
        // Handle view all purchases logic here
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
                        <Text variant="headlineSmall">{name}</Text>
                        <IconButton
                            icon="rename-box"
                            iconColor="#A9A9A9"
                            size={20}
                            onPress={() => console.log('Pressed')}
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
                        <Text variant="headlineSmall">{email}</Text>
                        <IconButton
                            icon="rename-box"
                            iconColor="#A9A9A9"
                            size={20}
                            onPress={() => console.log('Pressed')}
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
                <Title style={{color:"white"}}>Your Recent Purchase:</Title>
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
                        <View style={{
                        flexDirection: "column",
                        justifyContent: "space-between",
                        }}>
                            <Text variant="titleLarge">Velocity Cafe</Text>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}>
                            <Text style={{marginTop:7}} variant="bodyLarge">Savory Box</Text>
                            <Text style={{marginLeft:10, marginTop:7}} variant="bodyLarge">40 TL</Text>
                            <Button style={{marginLeft:80}} title="Leave a Review"  compact="true" onPress={handleLeaveReview}> Leave a Review </Button>
                            </View>
                            <Text variant="bodyLarge">21/12/2023</Text>
                        </View>
                    </Card.Content>
                </Card>
                <Button title="View All Past Purchases" mode="text" buttonColor="white" onPress={handleViewAllPurchases}> View All Past Purchases </Button> 
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
                {
                    buttonTexts.map((buttonText, index) => (
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
                    ))
                }
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

