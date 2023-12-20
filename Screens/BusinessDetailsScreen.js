import { LinearGradient } from "expo-linear-gradient";
import React from "react";
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
  Dialog
} from "react-native-paper";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

const BusinessDetailsScreen = ({ navigation, route }) => {
  const containerStyle = {backgroundColor: 'white', padding: 20};
  const { business } = route.params;

  const [modalVisible, setModalVisible] = React.useState(false);
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [checked, setChecked] = React.useState('');

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false); 

  const showDialog = () => {
    setDialogVisible(true);
    hideModal();
  }
  const hideDialog = () => setDialogVisible(false);

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
          style={{ margin: 8, marginTop: 30, zIndex: 1 }}
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
              {business.name}
            </Text>
            <Paragraph style={{ color: "white" }}>
              Open hours: {business.openingTime} to {business.closingTime}
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
                <Text> {business.address} </Text>
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
                <Text> {business.rating} </Text>
              </Paragraph>
              <Button mode="text" compact textColor="#ffe6a3">
                <Text> View Reviews </Text>
              </Button>
            </View>
            <View style={{ flexDirection: "row", marginTop: 16 }}>
              <FontAwesome5Icon
                name="heart"
                size={20}
                style={{ marginRight: 4, color: "white" }}
              />
              <Paragraph style={{ color: "white" }}>
                <Text> Add to your favorites </Text>
              </Paragraph>
            </View>
            <View style={{ flexDirection: "row", marginTop: 16 }}>
              <Button
                icon={() => (
                  <FontAwesome5Icon
                    name="exclamation-triangle"
                    size={20}
                    color="white"
                  />
                )}
                onPress={() => console.log("Report")}
                mode="contained"
                buttonColor="#f2b149"
              >
                <Text>Report</Text>
              </Button>
            </View>
          </View>
          <View style={{ flexDirection: "column" }}>
            <Image
              source={business.logo}
              style={{
                width: 100,
                height: 100,
                borderRadius: 8,
              }}
              backgroundColor="white"
            />
          </View>
        </View>
      </LinearGradient>
      <View style={{ padding: 16 }}>
      <Portal>
          <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={containerStyle}>  
            <Title>Choose A Time To Pick Up The Box</Title>
            <View style={{ flexDirection: "row"}}>
              <RadioButton value="first" status={checked === "first" ? "checked" : "unchecked" } onPress={() => setChecked("first")}/>  
              <Text style={{marginTop:10}}> 17:00-17.30 </Text>
            </View>
            <View style={{ flexDirection: "row"}}>
              <RadioButton value="second" status={checked === "second" ? "checked" : "unchecked" } onPress={() => setChecked("second")}/>
              <Text style={{marginTop:10}}> 17:30-18:00 </Text>
            </View>
            <View style={{ flexDirection: "row"}}>
              <RadioButton value="third" status={checked === "third" ? "checked" : "unchecked" } onPress={() => setChecked("third")}/>
              <Text style={{marginTop:10}}> 18:30-19:00 </Text>
            </View>
            <Button mode="contained" onPress={showDialog}>Make A Reservation</Button>  
          </Modal>
        </Portal>

        <Portal>
          <Dialog visible={dialogVisible} onDismiss={hideDialog}>
            <Dialog.Content>
              <Title>Reservation Successful</Title>
              <Paragraph>You can pick up your box between 17:30-18:00.</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal> 
        <Title>Available Offers</Title>
        {business.isOpen ? (
          Array.isArray(business.offers) && business.offers.length > 0 ? (
            business.offers.map((offer, index) => (
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
                    <Text>{offer.name}</Text>
                    <Text>{offer.price}</Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Paragraph style={{ fontStyle: "italic" }}>
              No offers available right now.
            </Paragraph>
          )
        ) : (
          <Paragraph style={{ fontStyle: "italic" }}>
            Business is closed, come back later.
          </Paragraph>
        )}
      </View>
    </ScrollView>
  );
};

export default BusinessDetailsScreen;
