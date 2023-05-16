import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import md5 from 'md5';
import Identify from '@helper/Identify';
import Events from '@helper/config/events';
import material from '../../../../../native-base-theme/variables/material';

const OutStockLabel = (props) => {
    if (Events.events.out_stock_label.length > 0) {
        let item = []
        for (let i = 0; i < Events.events.out_stock_label.length; i++) {
            let label = Events.events.out_stock_label[i];
            if (label.active === true) {
                let key = md5("out_stock_custom" + i);
                let Content = label.content;
                item.push(<Content key={key} />)
            }
        }
        return item;
    } else return (
        <View style={styles.productsContainer}>
            <Text style={[{ fontFamily: material.fontBold }, styles.text, Identify.isRtl() ? { left: 0 } : { right: 0 }, props.fontSize ? { fontSize: props.fontSize } : {}]}>
                {Identify.__('OUT OF STOCK')}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    productsContainer: {
        position: 'absolute',
        top: 12,
        left: 0,
        backgroundColor: '#828282',
        padding: 4
    },
    text: {
        color: 'white',
    }
})

export default OutStockLabel;