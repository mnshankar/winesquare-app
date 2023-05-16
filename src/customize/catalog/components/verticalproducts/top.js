import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import styles from './styles';
import Identify from '@helper/Identify';
import FastImage from 'react-native-fast-image'
const ProductAction = (props) => {

    if (!props.parent.state.showActions) {
        return (null);
    }
    let data = props.parent.state.data;
    let showFilter = false;
    let filterSelected = false;
    if (data.layers) {
        if ((data.layers.layer_filter && data.layers.layer_filter.length > 0) || (data.layers.layer_state && data.layers.layer_state.length > 0)) {
            showFilter = true;
            if (data.layers.layer_state && data.layers.layer_state.length > 0) {
                if (data.layers.layer_state.length == 1) {
                    if (data.layers.layer_state[0].attribute == 'cat') {
                        filterSelected = false;
                    } else {
                        filterSelected = true;
                    }
                } else {
                    filterSelected = true;
                }
            } else {
                filterSelected = false;
            }
        }
    }
    let showSort = false;
    if (data.orders && data.products.length > 0) {
        showSort = true;
    }
    return (
        <View style={styles.bottom}>
            {showFilter ?
                <TouchableOpacity style={[styles.action, { borderRightWidth: 1, borderRightColor: '#E0E0E0' }]} onPress={() => { props.parent.openFilter() }}>
                    <FastImage source={require('../../../img/icon_filter.png')} style={styles.icon} resizeMode={FastImage.resizeMode.contain} />
                    <Text style={styles.txtAction}>{Identify.__('Filter')}</Text>
                </TouchableOpacity>
                : null}
            {showSort ?
                <TouchableOpacity style={styles.action} onPress={() => { props.parent.openSort() }}>
                    <FastImage resizeMode={FastImage.resizeMode.contain} source={require('../../../img/icon_sort.png')} style={styles.icon} />
                    <Text style={styles.txtAction}>{Identify.__('Sort by')}</Text>
                </TouchableOpacity>
                : null}
        </View>
    );

}

export default ProductAction;