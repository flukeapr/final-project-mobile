import { Camera, CameraType } from "expo-camera";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as FaceDetector from "expo-face-detector";

export default function ARScreen() {
  
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [faceBounds, setFaceBounds] = useState(null);
  const [type , setType] = useState(CameraType.front)
  const [expression, setExpression] = useState("");

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  
  const handleFacesDetected = ({ faces }) => {
    if (faces.length > 0) {
      const { bounds, smilingProbability } = faces[0];
      setFaceBounds(bounds);
      
    
     if (smilingProbability > 0.3) { // Adjust this threshold as needed
      
        setExpression("Happy");
      } else {
        
        setExpression("Sad");
      }
    } else {
      setFaceBounds(null);
      setExpression(""); // Reset expression if no face detected
    }
  };
  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={CameraType.front}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.all,
          minDetectionInterval: 500,
          tracking: true,
        }}
      >
       {faceBounds && (
        <View
          style={[
            styles.faceBorder,
            {
              left: faceBounds.origin.x,
              top: faceBounds.origin.y,
              width: faceBounds.size.width,
              height: faceBounds.size.height,
            },
          ]}
        />
      )}
      {faceBounds && (
        <Text
          style={[
            styles.expressionText,
            {
              position: 'absolute',
              left: faceBounds.origin.x,
              top: faceBounds.origin.y + faceBounds.size.height + 10, // Adjusting position below the face border
            },
          ]}
        >
          {expression}
        </Text>
      )}
    {/* <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View> */}
        
      </Camera>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", 
  },
  camera: {
    flex: 1,
    width: "100%", 
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0077b6",
  },
  faceBorder: {
    position: "absolute",
    borderColor: "green",
    borderWidth: 2,
    borderRadius: 10,
  },
  expressionText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
    marginTop: 20,
    textAlign: "center",
  }
});
