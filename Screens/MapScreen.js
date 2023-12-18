import React, {useState} from 'react';
import MapView, {Marker, Callout} from 'react-native-maps';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';


export default function MapScreen({navigation}) {
    const businessesData = [
        {
          id: 1,
          name: "Velocity Cafe",
          logo: require("../assets/businesslogos/logo_bakery.png"),
          isOpen: true,
          availableOffers: true,
          openingTime: "10:00",
          closingTime: "20:00",
        },
        {
          id: 2,
          name: "Beethoven Cafe",
          logo: require("../assets/businesslogos/logo_coffee.png"),
          isOpen: true,
          availableOffers: true,
          openingTime: "10:00",
          closingTime: "20:00",
        },
        {
          id: 3,
          name: "Cafe Fiery",
          logo: require("../assets/businesslogos/logo_F.jpeg"),
          isOpen: true,
          availableOffers: true,
          openingTime: "10:00",
          closingTime: "20:00",
        },
        {
          id: 4,
          name: "Rooftop Restaurant",
          logo: require("../assets/businesslogos/logo_salad.png"),
          isOpen: true,
          availableOffers: false,
          openingTime: "10:00",
          closingTime: "20:00",
        },
        {
          id: 5,
          name: "Tea Break",
          logo: require("../assets/businesslogos/logo_tea.jpeg"),
          isOpen: false,
          availableOffers: true,
          openingTime: "10:00",
          closingTime: "20:00",
        },
      ];
    // initial start coordinates of the map
    const initialRegion ={
        latitude: 39.868254625289254, 
        latitudeDelta: 0.008569388910380837,
        longitude: 32.74868996813893,
        longitudeDelta: 0.005345307290554047
    };
    // Function to get business data based on marker ID
    const getBusinessData = (markerId) => {
        return businessesData.find(business => business.id === markerId);
    };
    // when the text field on top of a marker is pressed, change screen
    const onCalloutPress = (businessId) => {
        const businessData = getBusinessData(businessId);
        navigation.navigate("BusinessDetailsScreen", { business: businessData });
    };
    // set use state to null first, update when a marker is pressed
    const [selectedMarker, setSelectedMarker] = useState(null);
    // set selected marker
    const onMarkerPress = (marker) => {
        setSelectedMarker(marker);
    };

    // holds the markers to be displayed on the map
    const markers = [
        { id: 1, latitude: 39.86613476149862, longitude: 32.74841331751553, title: 'Velocity Cafe', description: 'Open' },
        { id: 2, latitude: 39.86883769578915, longitude: 32.74804230022964, title: 'Beethoven Cafe', description: 'Open' },
        { id: 3, latitude: 39.866477179576485, longitude: 32.74918382453541, title: 'Cafe Fiery', description: 'Open' },
        { id: 4, latitude: 39.867819957719306, longitude: 32.74816290905867, title: 'Rooftop Restaurant', description: 'No offers available right now' },
        { id: 5, latitude: 39.86828221142914, longitude: 32.74911772286561, title: 'Tea Break', description: 'Closed' },
        
    ];
    
    // to record the latitude longitude values when screen is moved
    const onRegionChange = (region) => {
        console.log(region);
    };
    return (
    <View style={styles.container}>
        <MapView style={styles.map}
            initialRegion = {initialRegion}
            onRegionChange={onRegionChange}>
        
            {markers.map((marker) => (
                <Marker
                key={marker.id}
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                title={marker.title}
                description={marker.description}
                >
                <Callout onPress={() => onCalloutPress(marker.id)}>
                    <View>
                        <Text>{marker.title}</Text>
                        <Text>{marker.description}</Text>
                        <TouchableOpacity>
                            <Text>View Details</Text>
                        </TouchableOpacity>
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
    width: '100%',
    height: '100%',
  },
});


