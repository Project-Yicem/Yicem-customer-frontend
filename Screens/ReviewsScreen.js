import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Card,
  Paragraph,
  Title,
  Appbar,
  ActivityIndicator,
} from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { IP_ADDRESS } from "../Functions/GetIP";
import StarRating from "react-native-star-rating";

const ReviewsScreen = ({ navigation, route }) => {
  const [pageTitle, setPageTitle] = useState(
    "Reviews of " + route.params.business.businessName
  );
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    const apiUrl = `http://${IP_ADDRESS}:8080/api/buyer/business/${route.params.business.id}/reviews`;
    const userToken = await SecureStore.getItemAsync("userToken");

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      console.log("Reviews data fetched in ReviewsScreen", response.data);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews data:", error);
    }

    setIsLoadingReviews(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <ScrollView>
      <Appbar.Header style={{ backgroundColor: "#f25e35" }}>
        <Appbar.Action
          icon="arrow-left"
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content title={pageTitle} color="white" />
      </Appbar.Header>
      <View style={{ padding: 16 }}>
        {isLoadingReviews && (
          <ActivityIndicator animating={true} color="#f25e35" size="large" />
        )}
        {!isLoadingReviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id} style={{ marginBottom: 12, borderRadius: 8 }}>
              <Card.Content>
                <Title>"{review.comment}"</Title>
                <StarRating
                  disabled={true}
                  maxStars={5}
                  rating={review.rating}
                  starSize={20}
                  fullStarColor={"#f25e35"}
                  containerStyle={{
                    alignSelf: "flex-start",
                    marginTop: 4,
                    gap: 4,
                  }}
                />
              </Card.Content>
            </Card>
          ))
        ) : !isLoadingReviews ? (
          <Paragraph style={{ fontStyle: "italic" }}>
            No reviews available yet.
          </Paragraph>
        ) : null}
      </View>
    </ScrollView>
  );
};

export default ReviewsScreen;
