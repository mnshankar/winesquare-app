import React from 'react';
import { TouchableOpacity, Image, View, Dimensions } from 'react-native';
import { Card, CardItem, Text, Button, Toast } from 'native-base';
import { connect } from 'react-redux';
import md5 from 'md5';
import Identify from '@helper/Identify';
import AppStorage from '@helper/storage';
import Events from '@helper/config/events';
import NewConnection from '@base/network/NewConnection';
import NavigationManager from '@helper/NavigationManager';
import SimiComponent from '@base/components/SimiComponent';
import material from '@theme/variables/material';
import { wishlist_item } from '../../../../plugins/constants';
import styles from './styles';
import Price from '../../../../core/screens/catalog/components/product/price';
import OutStockLabel from '../../../../core/screens/catalog/components/product/outStockLabel';
import FastImage from 'react-native-fast-image'

class VerticalProductItem extends SimiComponent {
    constructor(props) {
        super(props)
        this.storeConfig = Identify.getMerchantConfig().storeview.base;
        this.addedToWishlist = false;
        this.wishlistItemId = '';
        this.didRemoveProductFromWishlist = false;
    }

    renderOutStock() {
        if (this.props.product.is_salable == '0' || this.props.product.is_salable === null) {
            return <OutStockLabel />
        }
    }
    renderSpecialPriceLabel() {
        let saleOff = null;
        let price = this.props.product.app_prices;
        if (price.has_special_price !== null && price.has_special_price === 1) {
            if (price.show_ex_in_price != null && price.show_ex_in_price == 1) {
                saleOff = 100 - (price.price_including_tax.price / price.regular_price) * 100;
                saleOff = saleOff.toFixed(0);
            } else {
                saleOff = 100 - (price.price / price.regular_price) * 100;
                saleOff = saleOff.toFixed(0);
            }
        }
        let showLabel = Identify.getMerchantConfig().storeview.catalog.frontend.show_discount_label_in_product;
        if (saleOff) {
            if (showLabel && showLabel !== '1') {
                return null;
            }
            return (
                <View
                    style={{
                        position: 'absolute',
                        zIndex: 99,
                        left: 10,
                        top: 10,
                        backgroundColor: 'white',
                        borderRadius: 4,
                        borderColor: '#f0f0f0',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 2,
                        padding: 5,

                    }}
                >
                    <Text style={{ color: Identify.theme.button_background, fontFamily: material.fontBold, textAlign: 'center' }}>{saleOff + '% ' + Identify.__('OFF')}</Text>
                </View>
            )
        }
    }

    renderWinePoints() {
        if (this.props.product?.additional?.wine_point?.value) {
            return (
                <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: "red", borderRadius: 9999, width: 45, height: 45, flexDirection: 'row', justifyContent: "center", alignItems: "center", zIndex: 999 }}>
                    <Text style={{ color: "white", textAlign: "center" }}>
                        {this.props.product?.additional?.wine_point?.value}
                    </Text>
                </View>
            )
        }
        return null;
    }
    renderImage() {
        let source = (this.props.product.images && this.props.product.images.length > 0) ? { uri: this.props.product.images[0].url } : require('@media/logo.png');
        if (this.props.showList) {
            return (
                <CardItem cardBody style={{ borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                    <View style={[{ justifyContent: 'center', alignItems: 'center', width: "100%", position: 'relative' }]}>
                        {this.renderSpecialPriceLabel()}
                        {
                            this.props.product?.additional?.wine_point?.value ? this.renderWinePoints() : null
                        }
                        <FastImage resizeMode={FastImage.resizeMode.contain} source={source} style={[styles.imageList]} />
                        <View style={{ position: 'absolute', right: 5, bottom: 0 }}>
                            {this.renderOutStock()}
                        </View>
                        {this.dispatchContent()}
                    </View>
                </CardItem>
            )
        }
        return (
            <CardItem cardBody>
                <View style={styles.image}>
                    {this.renderSpecialPriceLabel()}
                    {
                        this.props.product?.additional?.wine_point?.value ? this.renderWinePoints() : null
                    }
                    <FastImage resizeMode={FastImage.resizeMode.contain} source={source} style={styles.image} />
                    {this.renderOutStock()}
                    {this.dispatchContent()}

                    {/* <TouchableOpacity
                        style={styles.iconWishlist}
                        onPress={this.addToWishlist}
                    >
                        <FastImage source={this.addedToWishlist ? require('../../../img/icon_wishlist.png') : require('../../../img/heart.png')} style={{ width: 24, height: 24 }} />
                    </TouchableOpacity> */}
                </View>
            </CardItem>
        );
    }

    checkTypeIdAndPrice() {
        if (this.props.product.type_id === 'configurable' && this.props.product.app_prices && this.props.product.app_prices.price == 0) {
            return false;
        }
        return true;
    }

    renderPrice() {
        let is_salable = this.props.product.is_salable == '0' || this.props.product.is_salable === null;
        if (this.checkTypeIdAndPrice()) {
            let fontSize = this.props.product.app_prices && this.props.product.app_prices?.low_price ? 16 : 18;
            if (this.props.showList) {
                return (
                    <TouchableOpacity
                        onPress={() => {
                            this.onAddToCart()
                        }}
                        style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', width: "100%", height: this.props.product.app_prices && this.props.product.app_prices?.low_price ? 70 : 50, paddingHorizontal: 15, backgroundColor: is_salable ? "#e0e0e0" : Identify.theme.button_background, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}
                        disabled={is_salable}
                    >
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
                            {
                                is_salable ?
                                    Identify.__('Out of Stock') :
                                    Identify.__('Add to cart')

                            }
                        </Text>
                        <Price
                            type={this.props.product.type_id}
                            prices={this.props.product.app_prices}
                            tierPrice={this.props.product.app_tier_prices}
                            styleDiscount={{ fontSize: 1 }}
                            navigation={this.props.navigation}
                            stylePrice={{ color: "white", fontWeight: "bold", fontSize: fontSize }}
                            styleSpecialPrice={{ color: "white", fontWeight: "bold", fontSize: fontSize }}
                            styleLabel={{ fontSize: 16, color: "white", marginRight: 3 }}
                        />
                    </TouchableOpacity>
                );
            } else {
                return (
                    <View style={{ marginTop: this.props.showList ? 10 : 0, paddingBottom: 10 }}>
                        <Price
                            type={this.props.product.type_id}
                            prices={this.props.product.app_prices}
                            tierPrice={this.props.product.app_tier_prices}
                            styleDiscount={{ fontSize: 1 }}
                            navigation={this.props.navigation}
                        />
                    </View>
                );
            }
        }
    }

    renderName() {
        let regex = /(<([^>]+)>)/ig;
        let name = this.props.product.name.replace(regex, "");
        name = name.replace("\n", "");
        if (this.props.showList) {
            return (
                <View style={{ width: '100%', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', position: 'relative' }}>
                    <View style={{ padding: 20 }}>
                        <Text style={{ fontSize: 18 }} numberOfLines={2}>{name}</Text>
                    </View>
                    {this.renderPrice()}
                </View>
            );
        }
        else {
            return (
                <CardItem style={{ paddingLeft: this.props.showList ? 10 : 5 }}>
                    <Text style={styles.name} numberOfLines={1}>{name}</Text>
                </CardItem>
            )
        }
    }

    renderAddBtn() {
        let showButton = true;
        if (this.storeConfig && this.storeConfig.hasOwnProperty('is_show_price_for_guest') &&
            this.storeConfig.is_show_price_for_guest == '0' && !Identify.getCustomerData()) {
            showButton = false;
        }
        if (this.props.product.is_salable != '1' || !showButton) {
            return (null);
        }
        return (
            <Button
                style={{ justifyContent: 'center', width: '100%', marginTop: 5 }}
                onPress={() => { this.onAddToCart() }}
            >
                <Text style={{ fontSize: 14, textAlign: 'center', fontFamily: material.fontBold }}>{Identify.__('Add To Cart')}</Text>
            </Button>
        )

    }

    addToWishlist = () => {
        if (!Identify.getCustomerData()) {
            NavigationManager.openPage(this.props.navigation, 'Login')
            return;
        }
        if (this.addedToWishlist) {
            this.props.storeData('showLoading', { type: 'dialog' });
            new NewConnection()
                .init(wishlist_item + '/' + this.wishlistItemId, 'remove_product', this, 'DELETE')
                .connect();
        } else {
            this.tracking();
            this.props.storeData('showLoading', { type: 'dialog' });
            new NewConnection()
                .init(wishlist_item, 'remove_product', this, 'POST')
                .addBodyData({ "product": this.props.product.entity_id, "qty": "1" })
                .connect();
        }
    }

    onAddToCart() {
        if (this.props.product.required_options == '1' || this.props.product.type_id != 'simple') {
            NavigationManager.openPage(this.props.navigation, 'ProductDetail', {
                productId: this.props.product.entity_id
            })
        } else {
            this.props.selectedProductModal(this.props.product);
            // let params = {};
            // params['product'] = this.props.product.entity_id;
            // params['qty'] = "1";
            // console.log("this.props.product: ", this.props.product)
            // console.log("params: ", params);
            // this.props.storeData('showLoading', { type: 'dialog' });

            // newConnection = new NewConnection();
            // newConnection.init(quoteitems, 'add_to_cart', this, 'POST');
            // newConnection.addBodyData(params);
            // newConnection.connect();
        }
    }
    setData(data, requestID) {
        if (requestID !== 'remove_product') {
            if (!Identify.TRUE(data.is_can_checkout)) {
                data['reload_data'] = true;
            }

            this.props.storeData('actions', [
                { type: 'showLoading', data: { type: 'none' } },
                { type: 'quoteitems', data: data }
            ]);
            if (data.quote_id && data.quote_id != '') {
                AppStorage.saveData('quote_id', data.quote_id);
            }
            if (data.message && data.message.length > 0) {
                Toast.show({
                    text: Identify.__(data.message[0]),
                    textStyle: { color: "yellow", fontFamily: material.fontFamily },
                    duration: 3000
                });
            }
        } else {
            console.log("2");
            this.props.storeData('showLoading', { type: 'none' });
            let product = this.props.product;
            if (data.wishlistitem) {
                this.addedToWishlist = true;
                this.wishlistItemId = data.wishlistitem.wishlist_item_id;
                product.wishlist_item_id = data.wishlistitem.wishlist_item_id
            } else if (data.wishlistitems) {
                this.didRemoveProductFromWishlist = true;
                this.addedToWishlist = false;
                product.wishlist_item_id = null;
            }
            let productData = {};
            productData[this.props.product.entity_id] = product;
            this.props.storeData('add_product_details_data', productData);
            this.setState({});
        }
    }
    handleWhenRequestFail() {
        this.props.storeData('showLoading', { type: 'none' });
    }
    renderItem() {
        if (this.props.showList) {
            return (
                <Card style={{ flex: 1, borderRadius: 5, marginTop: 10, marginLeft: 10, marginRight: 10, position: 'relative', }}>

                    {this.renderImage()}
                    {this.renderName()}
                    <TouchableOpacity
                        style={styles.iconWishlistList}
                        onPress={this.addToWishlist}
                    >
                        <FastImage source={this.addedToWishlist ? require('../../../img/icon_wishlist.png') : require('../../../img/heart.png')} style={{ width: 24, height: 24 }} />
                    </TouchableOpacity>
                </Card>
            )
        }
        else {
            return (
                <Card style={{ flex: 1, borderRadius: 5, marginTop: 0 }}>
                    {this.renderImage()}
                    {this.renderName()}
                    <View style={{ paddingLeft: 5 }}>
                        {this.renderPrice()}
                    </View>
                </Card>
            );
        }
    }

    openProductDetail() {
        NavigationManager.openPage(this.props.navigation, this.props.layout, {
            productId: this.props.product.entity_id,
            objData: this.props.product,
        });
    }

    renderPhoneLayout() {
        const { product } = this.props;
        if (product && this.didRemoveProductFromWishlist == false) {
            if (product.wishlist_item_id) {
                this.wishlistItemId = product.wishlist_item_id;
                this.addedToWishlist = true;
            }
        }

        return (
            <TouchableOpacity style={[this.props.itemStyle]}
                onPress={() => { this.openProductDetail() }}
            >
                {this.renderItem()}
            </TouchableOpacity>
        );
    }

    dispatchContent() {
        let items = [];
        if (Events.events.add_labels) {
            for (let i = 0; i < Events.events.add_labels.length; i++) {
                let node = Events.events.add_labels[i];
                if (node.active === true) {
                    let key = md5("add_labels" + i);
                    let price = this.props.product.app_prices;
                    let hasSpecial = price.has_special_price !== null && price.has_special_price === 1;
                    let Content = node.content;
                    items.push(<Content key={key} hasSpecial={hasSpecial} type={this.props.showList ? '2' : '3'} product={this.props.product} />)
                }
            }
        }
        return items;
    }

    tracking() {
        let data = {};
        data['event'] = 'product_action';
        data['action'] = 'added_to_wishlist';
        data['product_name'] = this.props.product.name;
        data['product_id'] = this.props.product.entity_id;
        data['sku'] = this.props.product.sku;
        data['qty'] = '1';
        Events.dispatchEventAction(data, this);
    }
}

const mapStateToProps = (state) => {
    return {
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

export default connect(mapStateToProps, mapDispatchToProps)(VerticalProductItem);
