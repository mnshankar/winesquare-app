import React from 'react';
import { View, Image, TouchableHighlight, Platform, TouchableOpacity } from 'react-native';
import { Text, Badge } from 'native-base';
import { connect } from 'react-redux';
import Identify from '@helper/Identify'
import NavigationManager from '@helper/NavigationManager';
import FastImage from 'react-native-fast-image'
class ItemBottomMenu extends React.Component {

    openPage() {
        let route_name = this.props.data.route_name;
        if (route_name === 'Wishlist') {
            if (!Identify.getCustomerData()) {
                NavigationManager.openRootPage(this.props.navigation, 'Login');
            } else {
                NavigationManager.openPage(this.props.navigation, 'Wishlist');
            }
        } else if (route_name === 'MyAccount') {
            if (!Identify.getCustomerData()) {
                NavigationManager.openPage(this.props.navigation, 'Login');
            } else {
                NavigationManager.openRootPage(this.props.navigation, 'MyAccount');
            }
            this.props.storeData('actions', [
                {
                    type: 'show_welcome', data: {
                        'show': false
                    }
                }
            ]);
        } else if (route_name === 'Products') {
            let cateId = '57';
            if (Identify.getMerchantConfig().storeview.base.offer_cate_id) {
                cateId = Identify.getMerchantConfig().storeview.base.offer_cate_id;
            }
            if (Identify.getMerchantConfig().storeview.base.is_active_offer && Identify.getMerchantConfig().storeview.base.is_active_offer == '1') {
                NavigationManager.openPage(this.props.navigation, 'Category', { categoryId: -1, categoryName: 'OFFERS' });
            } else {
                NavigationManager.openPage(this.props.navigation, 'Products', { categoryId: '-99999', categoryName: 'OFFERS' });
            }
        } else {
            NavigationManager.openRootPage(this.props.navigation, route_name);
        }
    }

    renderQty() {
        let qtyStyle = { position: 'absolute', end: 10, top: -5, height: 15, paddingBottom: 0, right: Identify.isRtl() ? 8 : -8 }
        let textQtyStyle = Platform.OS === "ios" ? { fontSize: 8, lineHeight: 0 } : { fontSize: 9 };
        let qty = (this.props.quoteitems && this.props.quoteitems.cart_total) ? (
            <TouchableOpacity style={qtyStyle}
                underlayColor="white"
                onPress={() => { NavigationManager.openRootPage(this.props.navigation, 'Cart', {}); }}>
                <Badge style={{ height: 18, paddingLeft: 4, paddingRight: 4, alignItems: "center", justifyContent: 'center' }}>
                    <Text style={textQtyStyle}>{this.props.quoteitems.cart_total}</Text>
                </Badge>
            </TouchableOpacity>
        ) : null

        return (qty);
    }

    render() {

        return (
            <TouchableHighlight onPress={() => this.openPage()}
                underlayColor="white"
                style={{
                    width: '100%', flex: 1, backgroundColor: 'white', height: 56, justifyContent: 'center', alignItems: 'center',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                }}>
                <View style={{ flexDirection: 'column' }}>
                    <FastImage
                        source={this.props.data.icon}
                        style={{
                            width: 24, height: 24,
                            marginLeft: 'auto', marginRight: 'auto',
                            tintColor: this.props.current_screen == this.props.data.route_name ? '#224299' : '#4F4F4F',

                        }} />
                    {this.props.data.key == 'cart_bottom' ? this.renderQty() : null}
                    <Text style={{
                        width: '100%', textAlign: 'center', fontSize: 10,
                        marginTop: 3,
                        color: this.props.current_screen == this.props.data.route_name ? '#224299' : '#4F4F4F',
                        paddingLeft: this.props.data.key == 'cart_bottom' ? 4 : 0,
                    }}>{this.props.data.title}</Text>
                </View>
            </TouchableHighlight>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(null, mapDispatchToProps)(ItemBottomMenu);