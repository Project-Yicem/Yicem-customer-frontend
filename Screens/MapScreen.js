import React, { useState } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import businessData from "../DataFiles/businessesData";

export default function MapScreen({ navigation }) {
  // initial start coordinates of the map
  const initialRegion = {
    latitude: 39.868254625289254,
    latitudeDelta: 0.008569388910380837,
    longitude: 32.74868996813893,
    longitudeDelta: 0.005345307290554047,
  };

  // Function to get business data based on marker ID
  const getBusinessData = (markerId) => {
    return businessesData.find((business) => business.id === markerId);
  };

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

  // Create markers based on the business data
  const markers = businessData.map((business) => ({
    id: business.id,
    latitude: business.latitude,
    longitude: business.longitude,
    title: business.name,
    description: business.open ? "Open" : "Closed",
  }));

  // to record the latitude longitude values when screen is moved
  const onRegionChange = (region) => {
    console.log(region);
  };

  return (
    <View style={styles.container}>
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
                <Text>{marker.title}</Text>
                <Text>{marker.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
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
