import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Card, Paragraph, Title, Appbar } from "react-native-paper";

const ReviewsScreen = ({ navigation, route }) => {
  // Sample reviews data
  const reviews = [
    { id: 1, user: "User1", comment: "Great experience! Highly recommended." },
    { id: 2, user: "User2", comment: "Nice place, friendly staff." },
    // Add more sample reviews as needed
  ];
  const [pageTitle, setPageTitle] = useState(
    "Reviews of " + route.params.business.name
  );

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
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id} style={{ marginBottom: 12, borderRadius: 8 }}>
              <Card.Content>
                <Title>{review.user}</Title>
                <Paragraph>{review.comment}</Paragraph>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Paragraph style={{ fontStyle: "italic" }}>
            No reviews available yet.
          </Paragraph>
        )}
      </View>
    </ScrollView>
  );
};

export default ReviewsScreen;
