import React, { useEffect, useState } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import { IP_ADDRESS } from "../Functions/GetIP";
import { ActivityIndicator, Avatar, Title } from "react-native-paper";
import { Image } from "react-native";
import * as Location from "expo-location";

export default function MapScreen({ navigation }) {
  const [businessData, setBusinessData] = useState([]);
  const [businessDataLoading, setBusinessDataLoading] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied!");
        setCurrentRegion({
          latitude: 39.868254625289254,
          latitudeDelta: 0.008569388910380837,
          longitude: 32.74868996813893,
          longitudeDelta: 0.005345307290554047,
        });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      setCurrentRegion({
        latitude: 39.868254625289254,
        latitudeDelta: 0.008569388910380837,
        longitude: 32.74868996813893,
        longitudeDelta: 0.005345307290554047,
      });

      //console.error("Error getting user location:", error);
    }
  };

  // fetch business data from the backend
  const fetchBusinessData = async () => {
    setBusinessDataLoading(true);
    const apiUrl = `http://${IP_ADDRESS}:8080/api/buyer/view-businesses`;
    try {
      const response = await axios.get(apiUrl);
      setBusinessData(response.data);

      // Filter out the businesses that don't have a locationLatitude or locationLongitude
      response.data = response.data.filter(
        (business) =>
          business.locationLatitude !== null &&
          business.locationLongitude !== null
      );

      setMarkers(
        response.data.map((business) => ({
          id: business.id,
          latitude: parseFloat(business.locationLatitude),
          longitude: parseFloat(business.locationLongitude),
          title: business.businessName,
          description: business.address,
          logo: business.logo,
          isOpen: business.open,
        }))
      );
      console.log("Business data fetched in Map screen");

      setBusinessDataLoading(false);
    } catch (error) {
      console.error("Error fetching business data in map screen:", error);
    }
  };

  useEffect(() => {
    getUserLocation();
    fetchBusinessData();
  }, []);

  // when the text field on top of a marker is pressed, change screen
  const onCalloutPress = (businessId) => {
    const business = businessData.find((b) => b.id === businessId);
    if (business) {
      navigation.navigate("BusinessDetailsScreen", { business });
    }
  };
  // set use state to null first, update when a marker is pressed
  const [selectedMarker, setSelectedMarker] = useState(null);
  // set selected marker
  const onMarkerPress = (marker) => {
    setSelectedMarker(marker);
  };

  // to record the latitude longitude values when screen is moved
  const onRegionChange = (region) => {
    console.log(region);
  };

  return (
    <View style={styles.container}>
      {businessDataLoading || !currentRegion ? (
        <ActivityIndicator
          animating={true}
          color="#f25e35"
          size="large"
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        />
      ) : (
        <MapView
          style={styles.map}
          initialRegion={currentRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.title}
              description={marker.description}
            >
              <Callout
                onPress={() => onCalloutPress(marker.id)}
                style={{
                  width: 200,
                  height: 100,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <View>
                  <Title>{marker.title}</Title>
                  <Text>{marker.description}</Text>
                  <Text>{marker.isOpen ? "Open" : "Closed"}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: "95%",
    marginTop: 30,
  },
});
