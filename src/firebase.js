import firebase from 'firebase/app'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBB8ojCfnxYChleUAiAWo93yUVydFZLEe8",
    authDomain: "upyourlink-2556d.firebaseapp.com",
    databaseURL: "https://upyourlink-2556d.firebaseio.com",
    projectId: "upyourlink-2556d",
    storageBucket: "upyourlink-2556d.appspot.com",
    messagingSenderId: "476703718703",
    appId: "1:476703718703:web:acdb0360aaa2108a1935da",
    measurementId: "G-E43TDT50LR"
};

firebase.initializeApp(firebaseConfig);

export const storage = firebase.storage().ref().child('/thumbnails/');