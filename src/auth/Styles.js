import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../assets/styles/Colors';
const { width, height } = Dimensions.get("window");

export const Styles = StyleSheet.create({
    loginContainer:{
        padding: 10,
    },
    imageBg:{
        width: width,
        height: height
    },
    loginPanel: {
        margin: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        height: 300,
        shadowOffset: {
          width: 1,
          height: 2,
        },
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    
})
