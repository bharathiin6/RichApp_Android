/* eslint-disable quotes */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

class FirebaseAuthService {
  constructor() {}

  fireBaseDatabaseBaseUrl;
  appConfig;

  initializeFirebase() {
    let userConfig = {
        apiKey: "AIzaSyChUQeS8fOJNTRFvo9_dhI3Zc3ODojLO2k",
        databaseURL: "https://richapp-42e7d-default-rtdb.firebaseio.com",
        projectId: "richapp-42e7d",
        storageBucket:  "richapp-42e7d.appspot.com",
        messagingSenderId: "778706497441",
        appId: "1:778706497441:android:0302356abce9f2473865e0",
      };

      const config = {
        name: 'RichApp',
      };

    if (!firebase.apps.length) {
      this.appConfig = firebase.initializeApp(userConfig, config);
      this.fireBaseDatabaseBaseUrl = userConfig.fireBaseDatabaseBaseUrl;
    }
  }

  getAppConfig() {
      return this.appConfig;
  }
  
  getFireBaseDatabaseBaseUrl() {
    return this.fireBaseDatabaseBaseUrl;
  }

  get uid() {
    return (firebase.auth(this.appConfig).currentUser || {}).uid;
  }



  refByUser(userId) {
    if (this.fireBaseDatabaseBaseUrl != null && this.fireBaseDatabaseBaseUrl != undefined) {
      return database().ref(this.fireBaseDatabaseBaseUrl + '/' + "users/" + userId);
    }
    else {
      return database().ref("users/" + userId);
    }
  }

//   registerUser = async userInfo => {
//     try {
//       // TODO: FIXME
//       userfromFirebaseDB = await firebase.auth().createUserWithEmailAndPassword(userInfo.email, "123456");

//       if (userfromFirebaseDB) {
//         this.updateUser(this.uid, {
//           displayName: userInfo.userName,
//           username: userInfo.userName,
//           photoURL: userInfo.profileUrl //TODO:
//           //devices_registered_list: [] //TODO: need to set
//         });
//       }

//       return userfromFirebaseDB;
//     } catch (error) {
//       throw error;
//     }
//   };

  loginUser = async userInfo => {
    self = this;
    this.userInfo = userInfo;
    userfromFirebaseDB = null;

    try {
      userfromFirebaseDB = await auth()
      .signInAnonymously()
      .then(() => {
        console.log('User signed in anonymously');
      })
      .catch(error => {
        if (error.code === 'auth/operation-not-allowed') {
          console.log('Enable anonymous in your firebase console.');
        }
        console.error(error);
      });

      if (userfromFirebaseDB) {
        this.updateUser(this.uid, {
          displayName: userInfo.userName,
          username: userInfo.userName,
          photoURL: userInfo.profileUrl
        });
      }

      return userfromFirebaseDB;
    } catch (error) {
        Logger.log("Firebase User Login Error");
    }
  };

  signOut() {
    auth()
    .signOut()
    .then(() => console.log('User signed out!'));
  }

}

export default new FirebaseAuthService();
