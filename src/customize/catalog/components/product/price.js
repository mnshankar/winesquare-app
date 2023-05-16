import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native'
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';
import SimiComponent from "@base/components/SimiComponent";
import Price from './price/index';
import styles from './styles';

export default class ProductPriceComponent extends SimiComponent {

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

    checkTypeIdAndPrice() {
        if (this.props.product.type_id === 'configurable' && this.props.product.app_prices && this.props.product.app_prices.price == 0) {
            return false;
        }
        return true;
    }

    openVisual = () => {
        NavigationManager.openPage(this.props.navigation, 'WebViewPage', {
            uri: this.props.product.visualize_in_your_space
        });
    }

    renderPrice() {
        if (this.props.product.type_id !== 'grouped' && this.checkTypeIdAndPrice()) {
            return (
                <Price
                    type={this.props.product.type_id}
                    prices={this.props.product.app_prices}
                    tierPrice={this.props.product.app_tier_prices}
                    styleDiscount={styles.price}
                    onRef={ref => (this.prices = ref)}
                    navigation={this.props.navigation}
                    screen='details'
                />
            )
        }
    }
    renderPhoneLayout() {
        const { product } = this.props
        if (product == null) {
            return (null);
        }

        return (
            <View style={{ marginHorizontal: 10,paddingTop: 10,
                paddingBottom: 10,
                borderTopWidth: 1,
                borderTopColor: '#E0E0E0' }}>
                    {this.renderPrice()}
            </View>
        );
    }

    updatePrices(newPrices) {
        this.prices.updatePrices(newPrices);
    }
}