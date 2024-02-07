import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Camera, CameraType, takePictureAsync } from "expo-camera";
import { useEffect, useState } from "react";
import { Button, TouchableOpacity, Image } from "react-native";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString, uploadBytes } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
 apiKey: "AIzaSyA3zb5ooCADK2iwDfRHiYC95nh-9WErXLg",
 authDomain: "se-asad-is-special.firebaseapp.com",
 projectId: "se-asad-is-special",
 storageBucket: "se-asad-is-special.appspot.com",
 messagingSenderId: "445933065747",
 appId: "1:445933065747:web:bd512c6c7040abee4791e6",
};


export default function App() {
 const [type, setType] = useState(CameraType.back);
 const [permission, requestPermission] = Camera.useCameraPermissions();
 const [cameraOpen, setCameraOpen] = useState(false);
 const [base64Img, setBase64Img] = useState(null);


 useEffect(() => {
   // Initialize Firebase
   const app = initializeApp(firebaseConfig);
   const storage = getStorage(app);
 }, []);


 function toggleCameraType() {
   setType((current) =>
     current === CameraType.back ? CameraType.front : CameraType.back
   );
 }


 async function openCamera() {
   if (cameraOpen) {
     const perm = await Camera.getCameraPermissionsAsync();
     requestPermission();
   }
   setCameraOpen(!cameraOpen);
 }


 async function takePicture() {
   const picture = await camera.takePictureAsync({
     base64: true,
     scale: 0.2,
   });


   setBase64Img(picture.base64);
 }


 async function uploadImage() {
   const storage = getStorage();
   const storageRef = ref(storage, 'images/' + new Date().toISOString() + '.png');


   // Convert base64 string to a Blob
   const fetchResponse = await fetch(`data:image/png;base64,${base64Img}`);
   const blob = await fetchResponse.blob();


   // Upload the Blob to Firebase Storage
   const uploadResult = await uploadBytes(storageRef, blob);
   console.log('Image uploaded to: ', uploadResult.metadata.fullPath);
   if (uploadResult.metadata.fullPath) {
     alert('Image uploaded to: ' + uploadResult.metadata.fullPath);
     reset();
   }
 }


 function reset() {
   setBase64Img(null);
   setCameraOpen(false);
 }


 return (
   <View style={styles.container}>
     {cameraOpen && !base64Img ? (
       <View style={styles.cameraContainer}>
         <Camera
           type={type}
           style={{ width: 400, height: 400 }}
           ref={(r) => {
             camera = r;
           }}
         >
           <View>
             <TouchableOpacity onPress={takePicture}>
               <Text>Take Picture</Text>
             </TouchableOpacity>
           </View>
           <View>
             <TouchableOpacity onPress={toggleCameraType}>
               <Text>Flip Camera</Text>
             </TouchableOpacity>
           </View>
         </Camera>
         <TouchableOpacity>
           <Text onPress={openCamera}>Close Camera</Text>
         </TouchableOpacity>
       </View>
     ) : cameraOpen && base64Img ? (
       <View>
         <Text>Picture was taken</Text>
         <Image
           style={{
             height: 200,
             width: 200,
           }}
           source={{
             uri: `data:image/png;base64,${base64Img}`,
           }}
         />
         <View>
           <TouchableOpacity onPress={reset}>
             <Text>Reset</Text>
           </TouchableOpacity>
         </View>
         <View>
           <TouchableOpacity onPress={uploadImage}>
             <Text>Send to Spark</Text>
           </TouchableOpacity>
         </View>
       </View>
     ) : (
       <View>
         <Text>Hello World</Text>
         <TouchableOpacity onPress={openCamera}>
           <Text>Open Camera</Text>
         </TouchableOpacity>
         <StatusBar style="auto" />
       </View>
     )}
   </View>
 );
}


const styles = StyleSheet.create({
 cameraContainer: {
   flex: 0.4,
   justifyContent: "center",
 },
 container: {
   flex: 1,
   backgroundColor: "#fff",
   alignItems: "center",
   justifyContent: "center",
 },
});
