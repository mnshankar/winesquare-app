import React from 'react';
import { View, TouchableOpacity } from 'react-native'
import { Text } from 'native-base'
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';
import SimiComponent from "@base/components/SimiComponent";
import Price from './price/index';
import styles from './styles';
import material from '../../../../../native-base-theme/variables/material';

export default class AvailableComponent extends SimiComponent {

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this)
        }
    }
    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined)
        }
    }

    openVisual = () => {
        NavigationManager.openPage(this.props.navigation, 'WebViewPage', {
            uri: this.props.product.visualize_in_your_space
        });
    }

    renderPhoneLayout() {
        const { product } = this.props
        if (product == null) {
            return (null);
        }

        return (
            <View style={{ marginHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>{Identify.__('Availability')}:</Text>
                        <Text style={{ marginLeft: 8, color: product.is_salable === 1 ? '#2BA968' : '#D11F52' }}>{product.is_salable === 1 ? Identify.__('In stock') : Identify.__('Out of stock')}</Text>
                    </View>
                    {/* {product.is_salable === 1 && product.quantity_and_stock_status && product.quantity_and_stock_status.is_in_stock ?
                        <Text style={{}}>{Identify.__('Only')} {product.quantity_and_stock_status.qty} {Identify.__('left')}</Text> :
                        null} */}
                </View>
                {product.visualize_in_your_space ?
                    <TouchableOpacity
                        onPress={this.openVisual}
                        style={{ width: '100%', paddingVertical: 10, backgroundColor: '#ECEEF5', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}
                    >
                        <Text style={{ fontFamily: material.fontBold, fontSize: 16, color: '#224299' }}>{Identify.__('Visualize in your space')}</Text>
                    </TouchableOpacity>
                    : null
                }
            </View>
        );
    }

    updatePrices(newPrices) {
        this.prices.updatePrices(newPrices);
    }
}