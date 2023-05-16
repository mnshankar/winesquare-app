import React from 'react';
import Identify from '@helper/Identify';
import { Container, Content, Button, Text, View, Icon, Card, H2 } from "native-base";
import { TouchableOpacity, StyleSheet } from 'react-native';
import NavigationManager from '@helper/NavigationManager';
import { checkout_mode } from '@helper/constants';
import material from '../../../../../native-base-theme/variables/material';

const ThankOrder = (props) => {

    function onThankyouSelect() {
        NavigationManager.openPage(props.navigation, 'OrderHistoryDetail', { orderId: props.navigation.getParam('invoice') });
    }

    if (props.navigation.getParam('mode') == checkout_mode.guest) {
        return (
            <View style={{
                marginTop: 20,
                paddingTop: 15,
                paddingBottom: 15
            }}>
                <Text style={styles.orderLabel}>{Identify.__('Your order is')}: #{props.navigation.getParam('invoice')}</Text>
            </View>
        )
    } else {
        let disabledButton = props.navigation.getParam('mode') == checkout_mode.new_customer && !Identify.getCustomerData();
        return (
            <Card style={styles.card}>
                <View style={styles.cardContainer}>
                    <Text style={{ color: '#4F4F4F' }}>{Identify.__('Order Number')}</Text>
                    <Text style={{ color: '#4F4F4F', fontFamily: material.fontBold }}>{props.navigation.getParam('invoice')}</Text>
                </View>
                <View style={[styles.cardContainer, { marginTop: 8 }]}>
                    <Text style={{ color: '#4F4F4F' }}>{Identify.__('Payment Method')}</Text>
                    <Text style={{ color: '#4F4F4F', fontFamily: material.fontBold }}>{props.navigation.getParam('payment')}</Text>
                </View>
                {!disabledButton ?
                 <View style={{ width: '100%', marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: '100%', height: 1, backgroundColor: '#E0E0E0' }} />
                    <TouchableOpacity onPress={() => {
                        onThankyouSelect()
                    }}>
                        <Text style={{ marginTop: 15, textDecorationLine: 'underline', color: '#224299', fontSize: 13 }}>{Identify.__('VIEW ORDER DETAILS')}</Text>
                    </TouchableOpacity>
                </View> : null} 
            </Card>
        );
    }
}
const styles = StyleSheet.create({
    card: {
        flex: 1,
        marginTop: 30,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15
    },
    cardContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    orderLabel: {
        flex: 1
    },
    extendIcon: {
        marginLeft: 5,
        fontSize: 20,
        color: '#c9c9c9'
    },
    button: {
        marginTop: 30
    },
    content: {
        padding: 20,
    },
});

export default ThankOrder;