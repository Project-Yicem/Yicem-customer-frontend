import { View, ScrollView } from "react-native";
import { Searchbar, Card, Title, Paragraph } from "react-native-paper";

const BusinessDetailsScreen = ({ route }) => {
  const { business } = route.params;

  return (
    <View>
      <Title>{business.name}</Title>
      {/* Add more details here */}
    </View>
  );
};

export default BusinessDetailsScreen;
