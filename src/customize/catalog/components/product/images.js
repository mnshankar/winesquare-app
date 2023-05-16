import React from 'react';
import { TouchableOpacity, Image, View, Platform, Share } from 'react-native';
import { Card, Text } from 'native-base';
import md5 from 'md5';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import Device from '@helper/device';
import Identify from '@helper/Identify';
import simicart from '@helper/simicart';
import Events from '@helper/config/events';
import NewConnection from '@base/network/NewConnection';
import NavigationManager from '@helper/NavigationManager';
import SimiComponent from "@base/components/SimiComponent";
import { wishlist_item } from '../../../../plugins/constants';
import material from '../../../../../native-base-theme/variables/material';
import styles from './styles';
import FastImage from 'react-native-fast-image'
class ProductImagesComponent extends SimiComponent {
    constructor(props) {
        super(props)
        this.index = 0;
        this.addedToWishlist = false;
        this.wishlistItemId = '';
        this.didRemoveProductFromWishlist = false;
        this.productName = ''
        this.productURL = '';
        this.state = {
            ... this.state,
            showSwiper: false
        }
    }

    componentWillMount() {
        setTimeout(() => { this.setState({ showSwiper: true }) }, 500);
    }

    setData(data) {
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

    openShareDialog = () => {
        if (Platform.OS === 'ios') {
            Share.share({
                message: this.productName,
                url: this.productURL
            });
        } else {
            Share.share({
                message: this.productURL
            })
        }
    }

    onSelectImage(image) {
        NavigationManager.openPage(this.props.navigation, 'FullImage', {
            images: this.props.product.images,
            index: image
        });
    }

    renderImages() {
        let images = [];
        let data = JSON.parse(JSON.stringify(this.props.product.images));
        for (let i in data) {
            let image = data[i];
            image['simi_index'] = i;
            images.push(
                <TouchableOpacity
                    onPress={() => {
                        this.onSelectImage(i)
                    }}
                    key={image.position}
                    style={{ flex: 1 }}>
                    <FastImage resizeMode={FastImage.resizeMode.contain} source={{ uri: image.url }}
                        style={[styles.bannerImage, (!Device.isTablet() || this.isPortrait()) && { aspectRatio: 1 }]} />
                </TouchableOpacity>
            );
            i++;
        }
        return images;
    }

    renderActionButton() {
        return (
            <View style={styles.imageActions}>
                <TouchableOpacity style={[styles.action, { marginBottom: 12 }]} onPress={this.addToWishlist} >
                    <FastImage source={this.addedToWishlist ? require('../../../img/icon_wishlist.png') : require('../../../img/heart.png')} style={styles.iconImg} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.action} onPress={this.openShareDialog} >
                    <FastImage source={require('../../../img/icon_zoom.png')} style={styles.iconImg} />
                </TouchableOpacity>
            </View>
        )
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
                        padding: 5
                    }}
                >
                    <Text style={{ color: Identify.theme.button_background, fontFamily: material.fontBold, textAlign: 'center' }}>{saleOff + '% ' + Identify.__('OFF')}</Text>
                </View>
            )
        }
    }

    initProductURL() {
        let url = simicart.merchant_url;
        if (url.slice(-1) !== '/') {
            url = url + '/';
        }
        if (this.props.product.url_path && this.props.product.url_path != null && this.props.product.url_path != "") {
            this.productURL = url + this.props.product.url_path;
        } else {
            this.productURL = url + "catalog/product/view/id/" + this.props.product.entity_id;
        }
        this.productName = this.props.product.name
    }

    renderPhoneLayout() {
        const { product } = this.props;
        if (product == null) {
            return (null);
        }

        this.initProductURL();
        if (product && this.didRemoveProductFromWishlist == false) {
            if (product.wishlist_item_id) {
                this.wishlistItemId = product.wishlist_item_id;
                this.addedToWishlist = true;
            }
        }

        return (
            <Card style={[styles.bannerCard, (!Device.isTablet() || this.isPortrait()) && { aspectRatio: 1 }]}>
                <View style={{ flex: 1 }}>
                    {this.renderActionButton()}
                    {this.renderSpecialPriceLabel()}
                    {this.state.showSwiper ? <Swiper
                        onIndexChanged={(index) => {
                            this.index = index
                        }}
                        key={product.images.length}
                        horizontal={true}>
                        {this.renderImages()}
                    </Swiper> : null}
                    {this.dispatchContent()}
                </View>
            </Card>
        );
    }

    dispatchContent() {
        let items = [];
        if (Events.events.add_labels) {
            for (let i = 0; i < Events.events.add_labels.length; i++) {
                let node = Events.events.add_labels[i];
                if (node.active === true) {
                    let key = md5("add_labels" + i);
                    let Content = node.content;
                    let price = this.props.product.app_prices;
                    let hasSpecial = price.has_special_price !== null && price.has_special_price === 1;
                    items.push(<Content hasSpecial={hasSpecial} key={key} type={'4'} product={this.props.product} />)
                }
            }
        }
        return items;
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductImagesComponent);
