import React, { useEffect, useState } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import { IP_ADDRESS } from "../Functions/GetIP";
import { ActivityIndicator, Avatar, Title } from "react-native-paper";
import { Image } from "react-native";

export default function MapScreen({ navigation }) {
  const [businessData, setBusinessData] = useState([]);
  const [businessDataLoading, setBusinessDataLoading] = useState(false);
  const [markers, setMarkers] = useState([]);

  // initial start coordinates of the map
  const initialRegion = {
    latitude: 39.868254625289254,
    latitudeDelta: 0.008569388910380837,
    longitude: 32.74868996813893,
    longitudeDelta: 0.005345307290554047,
  };

  // fetch business data from the backend
  const fetchBusinessData = async () => {
    setBusinessDataLoading(true);
    const apiUrl = `http://${IP_ADDRESS}:8080/api/buyer/view-businesses`;
    try {
      const response = await axios.get(apiUrl);
      setBusinessData(response.data);
      setMarkers(
        response.data.map((business) => ({
          id: business.id,
          latitude: parseFloat(business.locationLatitude),
          longitude: parseFloat(business.locationLongitude),
          title: business.businessName,
          description: business.address,
          logo: business.logo,
        }))
      );
      console.log("Business data fetched in Map screen");
      console.log(markers[0]);

      setBusinessDataLoading(false);
    } catch (error) {
      console.error("Error fetching business data in map screen:", error);
    }
  };

  useEffect(() => {
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
      {businessDataLoading ? (
        <ActivityIndicator
          animating={true}
          color="#f25e35"
          size="large"
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        />
      ) : (
        <MapView style={styles.map} initialRegion={initialRegion}>
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
              <Callout onPress={() => onCalloutPress(marker.id)}>
                <View>
                  <Title>{marker.title}</Title>
                  <Text>{marker.description}</Text>
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
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
