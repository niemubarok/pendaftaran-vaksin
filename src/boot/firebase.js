
import firebase from 'firebase/app'
import 'firebase/firestore'

 const firebaseConfig = {
   apiKey: "AIzaSyCfGQ0eHS8vtE80TMQbZhHuwNlLhMNSzPY",
   authDomain: "vaksin-rsasm.firebaseapp.com",
   projectId: "vaksin-rsasm",
   storageBucket: "vaksin-rsasm.appspot.com",
   messagingSenderId: "21710642982",
   appId: "1:21710642982:web:48075f875a535fdc1a6be7",
 };

firebase.initializeApp(firebaseConfig)

let db = firebase.firestore()
let participants = db.collection('participants')
let quota = db.collection('quota')


export { db, participants, quota};


