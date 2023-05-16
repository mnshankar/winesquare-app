import React from 'react';
import { Alert, Keyboard, TouchableOpacity, Image } from 'react-native';
import { Text, Toast, View } from "native-base";
import { connect } from 'react-redux';
import Identify from '@helper/Identify';
import AppStorage from '@helper/storage';
import Events from '@helper/config/events';
import { quoteitems } from '@helper/constants';
import material from "@theme/variables/material";
import NewConnection from '@base/network/NewConnection';
import NavigationManager from '@helper/NavigationManager';
import SimiComponent from '@base/components/SimiComponent';
import Quantity from './qty';
import styles from './styles';
import FastImage from 'react-native-fast-image'
class AddToCart extends SimiComponent {

    constructor(props) {
        super(props);
        this.storeConfig = Identify.getMerchantConfig().storeview.base;
    }

    setData(data, requestID) {
        if (!Identify.TRUE(data.is_can_checkout)) {
            data['reload_data'] = true;
        }

        this.props.storeData('actions', [
            { type: 'showLoading', data: { type: 'none' } },
            { type: 'quoteitems', data: data }
        ]);
        if (data.quote_id && data.quote_id != null && data.quote_id != '' && !Identify.getCustomerData()) {
            AppStorage.saveData('quote_id', data.quote_id);
        }
        if (data.message && data.message.length > 0) {
            Toast.show({
                text: Identify.__(data.message[0]),
                type: 'success',
                textStyle: { color: "#fff", fontFamily: material.fontFamily },
                duration: 3000
            });
            if (requestID === 'buy_now') {
                NavigationManager.openPage(this.props.navigation, 'Cart', {})
            }
        }
    }

    handleWhenRequestFail() {
        this.props.storeData('showLoading', { type: 'none' });
    }

    tracking() {
        let data = {};
        data['event'] = 'product_action';
        data['action'] = 'added_to_cart';
        data['product_name'] = this.props.product.name;
        data['product_id'] = this.props.product.entity_id;
        data['price'] = this.props.product.price;
        data['sku'] = this.props.product.sku;
        data['qty'] = this.qty.getCheckoutQty();
        Events.dispatchEventAction(data, this);
    }

    checkEqualQty = (array) => {
        if (typeof array !== 'undefined') {
            return !!array.reduce(function (a, b) { return (a === b) ? a : NaN; });
        }
    }

    onClickAddToCart = (redirectCart) => {
        const { product } = this.props
        if (product.type_id === 'grouped' && product.app_options.grouped_options.filter(item => item.is_salable === '0').length > 0) {
            Alert.alert(
                Identify.__('Error'),
                Identify.__('Quantity of each product must be equal')
            );
            return
        }
        let params = {};

        let optionParams = this.props.parent.getOptionParams();

        if (optionParams && optionParams.super_group && !this.checkEqualQty(Object.values(optionParams.super_group))) {
            Alert.alert(
                Identify.__('Error'),
                Identify.__('Quantity of each product must be equal')
            );
            return
        }

        if (optionParams != null) {
            params = {
                ...optionParams,
            };
        } else if (product.has_options == '1' || product.type_id == 'grouped') {
            return;
        }

        params['product'] = product.entity_id;
        let qty = this.qty ? this.qty.getCheckoutQty() : '1';
        if (isNaN(qty) || parseInt(qty) == 0) {
            Alert.alert(
                Identify.__('Error'),
                Identify.__('Quantity is not valid')
            );
            return;
        }
        params['qty'] = qty;
        Keyboard.dismiss();
        if (parseInt(qty, 10) > 0) {
            this.tracking();

            this.props.storeData('showLoading', { type: 'dialog' });
            newConnection = new NewConnection();
            newConnection.init(quoteitems, redirectCart ? 'buy_now' : 'add_to_cart', this, 'POST');
            newConnection.addBodyData(params);
            newConnection.connect();
        }
    }

    render() {
        let showButton = true;
        if (this.storeConfig && this.storeConfig.hasOwnProperty('is_show_price_for_guest') &&
            this.storeConfig.is_show_price_for_guest == '0' && !Identify.getCustomerData()) {
            showButton = false;
        }
        if (!this.props.parent.product || !showButton) {
            return (null);
        }

        return (
            <View style={styles.addToCart}>
                {this.props.product.is_salable === 1 ?
                    <>
                        <Quantity onRef={ref => (this.qty = ref)} />
                        <TouchableOpacity style={[styles.btn, { backgroundColor: '#ECEEF5' }]} onPress={() => this.onClickAddToCart(false)}>
                            <FastImage source={require('../../../img/cart.png')} style={styles.icon} />
                            <Text style={[styles.textBtn, { color: '#224299', marginLeft: 9 }]}>{Identify.__('Add to Cart')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.onClickAddToCart(true)}
                            style={[styles.btn, { paddingHorizontal: 20, backgroundColor: Identify.theme.button_background }]}
                        >
                            <Text style={[styles.textBtn, { color: '#fff' }]}>{Identify.__('Buy Now')}</Text>
                        </TouchableOpacity>
                    </> :
                    <View style={[styles.btn, { backgroundColor: '#828282', width: '100%', justifyContent: 'center' }]}>
                        <Text style={[styles.textBtn, { color: '#fff', fontFamily: material.fontBold }]}>{Identify.__('Out of Stock')}</Text>
                    </View>
                }
            </View >
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.redux_data.quoteitems,
        customer_data: state.redux_data.customer_data,
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddToCart);
