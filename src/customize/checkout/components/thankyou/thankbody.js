import React from 'react';
import { Text } from "native-base";
import Identify from '@helper/Identify';
import { StyleSheet } from 'react-native';

const ThankBody = (props) => {

    return (
        <Text style={styles.message}>{Identify.__('Your order is currently being processed. You will receive an order confirmation email shortly with the expected delivery date for your items.')}</Text>
    );
}
const styles = StyleSheet.create({
    message: {
        marginTop: 20, alignSelf:'center', textAlign:'center', color:"#4F4F4F"
    },
});

export default ThankBody
