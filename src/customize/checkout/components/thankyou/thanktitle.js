import React from 'react';
import { Text } from "native-base";
import { View, Image } from 'react-native'
import Identify from '@helper/Identify';
import { StyleSheet } from 'react-native';
import material from '../../../../../native-base-theme/variables/material';
import FastImage from 'react-native-fast-image'
const ThankTitle = (props) => {
    return (
        <View style={{ width: '100%', alignItems: 'center', marginTop: 20 }}>
            <Text style={{ fontSize: 22, color: '#4F4F4F', fontFamily: material.fontBold }}>{Identify.__('ORDER CONFIRMED')}</Text>
            <FastImage style={{ width: 120, height: 120, resizeMode: 'contain', marginTop: 20 }} source={require('../../../img/thankyou.png')} />
            <Text style={styles.title}>{Identify.__('Thank you for your purchase')}</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    title: {
        color: '#4F4F4F',
        marginTop: 20,
        fontSize: 20
    },
});

export default ThankTitle;
