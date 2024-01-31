import React from "react";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import HomeScreen from "../Screens/HomeScreen";
import BusinessesScreen from "../Screens/BusinessesScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import MapScreen from "../Screens/MapScreen";
import PastPurchasesScreen from "../Screens/PastPurchasesScreen";

const Tab = createMaterialBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    initialRouteName="Home"
    activeColor="rgb(254, 93, 0)"
    barStyle={{ backgroundColor: "white", height: 70 }}
    labeled={false}
    options={{ tabBarColor: "black" }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: "Home",
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="home" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Map"
      component={MapScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="map" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Businesses"
      component={BusinessesScreen}
      options={{
        tabBarLabel: "Businesses",
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="coffee" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: "Profile",
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="account" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default MainTabs;
