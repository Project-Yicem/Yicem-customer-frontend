import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import { Button } from "react-native-paper";
import { View } from "react-native";

export default function ProfilePicturePicker({
  profilePicture,
  setProfilePicture,
}) {
  const uploadProfilePicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Please allow media permissions to upload a profile picture");
      return;
    }

    // Make the user choose a profile picture from their phone
    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!image.canceled) {
      // Check if the picture is larger than 1MB, return if it is
      if (image.assets[0].base64.length > 1048576) {
        alert("Please choose a picture smaller than 1MB.");
        return;
      }

      const fullBase64String = `data:image/${
        image.assets[0].uri.split(".")[1]
      };base64,${image.assets[0].base64}`;

      // Set the image to the state to display it
      setProfilePicture(fullBase64String);
    }
  };

  return (
    <>
      <Button mode="contained" onPress={() => uploadProfilePicture()}>
        Change Profile Picture
      </Button>
      {profilePicture && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <Image
            source={{ uri: profilePicture }}
            style={{ width: 100, height: 100 }}
          />
        </View>
      )}
    </>
  );
}
