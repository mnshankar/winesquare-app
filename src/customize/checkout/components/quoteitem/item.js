import React from 'react';
import { StyleSheet, TextInput, Image, Alert, TouchableOpacity } from 'react-native';
import { ListItem, Body, Right, Button, Icon, View, Text, Card } from 'native-base';
import QuoteItemView from './quote';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';
import NavigationManager from '@helper/NavigationManager';
import Format from '@screens/catalog/components/product/price/format';
import OutStockLabel from '@screens/catalog/components/product/outStockLabel';
import FastImage from 'react-native-fast-image'
const QuoteItem = (props) => {
    merchant_configs = Identify.isEmpty(Identify.getMerchantConfig()) ? null : Identify.getMerchantConfig();
    tax_cart_display_price = merchant_configs.storeview.tax.tax_cart_display_price;

    function showDeleteItemPopup() {
        Alert.alert(
            Identify.__('Warning'),
            Identify.__('Are you sure you want to delete this product?'),
            [
                { text: Identify.__('Cancel'), onPress: () => { style: 'cancel' } },
                {
                    text: Identify.__('OK'), onPress: () => {
                        props.parent.updateCart(props.data.item_id, 0)
                    }
                },
            ],
            { cancelable: true }
        );
    }

    function renderQtyBox() {

        let qtyBox = (
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                    onPress={() => {
                        if (parseInt(this.state.productModalQty) > 1) {
                            this.setState({
                                productModalQty: (parseInt(this.state.productModalQty) - 1).toString()
                            })
                        }
                    }}
                >

                    <View style={{ height: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon type='AntDesign' name="minuscircleo" style={{ fontSize: 20 }} />
                    </View>
                </TouchableOpacity>
                <TextInput
                    style={{ height: 40, width: 40, borderRadius: 5, marginHorizontal: 3, textAlign: 'center' }}
                    onChangeText={(qty) => {
                        this.setState({
                            productModalQty: qty
                        })
                    }}
                    placeholderTextColor="#000"
                    value={parseInt(props.data.qty.toString()).toString()}
                    editable={false}
                    underlineColorAndroid="transparent"
                    returnKeyType='done'
                    returnKeyLabel='done'
                    keyboardType="numeric"
                    onEndEditing={() => {
                        if (this.state.productModalQty == "0") {
                            this.setState({
                                productModalQty: "1"
                            })
                        }
                        this.setState({
                            height: this.heightDefault,
                            marginTop: this.height - this.heightDefault,
                        });
                        Keyboard.dismiss();
                    }}
                />
                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            productModalQty: (parseInt(this.state.productModalQty) + 1).toString()
                        })
                    }}
                >
                    <View style={{ height: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon type='AntDesign' name="pluscircleo" style={{ fontSize: 20 }} />
                    </View>
                </TouchableOpacity>

            </View>
        );
        if (props.parent.from && props.parent.from == 'cart' && (!props.data.product.is_salable || (props.data.product.is_salable && Identify.TRUE(props.data.product.is_salable)))) {
            qtyBox = (
                <View style={{ flexDirection: "row", alignItems: 'center', }}>
                    <TouchableOpacity
                        onPress={() => {
                            props.parent.updateCart(props.data.item_id, (parseInt(props.data.qty) - 1).toString())
                        }}
                    >

                        <View style={{ height: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Icon type='AntDesign' name="minuscircleo" style={{ fontSize: 20 }} />
                        </View>
                    </TouchableOpacity>
                    <TextInput
                        style={{ height: 40, width: 35, borderRadius: 5, marginHorizontal: 3, textAlign: 'center' }}
                        placeholderTextColor="#000000"
                        defaultValue={parseInt(props.data.qty.toString()).toString()}
                        keyboardType="numeric"
                        returnKeyType="done"
                        onSubmitEditing={(e) => {
                            let qty = e.nativeEvent.text;
                            if (isNaN(qty)) {
                                Alert.alert(
                                    Identify.__('Error'),
                                    Identify.__('Quantity is not valid')
                                );
                                return;
                            }
                            props.parent.qtySubmit(e, props.data.item_id, props.data.qty)
                        }}
                        underlineColorAndroid="transparent"
                    />
                    <TouchableOpacity
                        onPress={() => {
                            props.parent.updateCart(props.data.item_id, (parseInt(props.data.qty) + 1).toString())
                        }}
                    >
                        <View style={{ height: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Icon type='AntDesign' name="pluscircleo" style={{ fontSize: 20 }} />
                        </View>
                    </TouchableOpacity>

                </View>
            );
        }
        return qtyBox;
    }

    function renderMoveItem() {
        let remove_item = null;
        if (props.parent.from && props.parent.from == 'cart') {
            remove_item = (
                <Button style={{ position: 'absolute', top: 5, right: 5 }} transparent
                    onPress={() => { showDeleteItemPopup(props.data) }}>
                    <Icon style={{ textAlign: 'right', marginLeft: 0, marginRight: 0 }} name="ios-trash" />
                </Button>
            );
        }
        return remove_item;
    }
    function onItemSelect() {
        let route = 'ProductDetail';
        if (props.data.product_type === 'simigiftvoucher') {
            route = 'ProductGiftCardDetail'
        }
        NavigationManager.openPage(props.parent.props.navigation,
            route, {
            productId: props.data.product_id,
        })
    }

    function renderImageItem() {
        if (props.parent.is_go_detail) {
            return (
                <TouchableOpacity onPress={() => {
                    onItemSelect()
                }}>
                    <FastImage style={[styles.viewImage, {}]} source={{ uri: props.data.image }} resizeMode={FastImage.resizeMode.contain} />
                    {renderOutStock()}
                </TouchableOpacity>
            )
        }
        if (typeof props.data.image === 'string') {
            return (
                <FastImage style={styles.viewImage} source={{ uri: props.data.image }} resizeMode={FastImage.resizeMode.contain} />
            )
        } else {
            return (null)
        }
    }

    function renderOutStock() {
        if (props.data.product.hasOwnProperty('is_salable') && !Identify.TRUE(props.data.product.is_salable)) {
            return <OutStockLabel fontSize={12} />
        }
    }

    function renderPrice(quoteItem) {
        let price = <Format style={{ color: material.priceColor, fontSize: 16, fontFamily: material.fontBold, marginTop: 8 }} price={quoteItem.row_total} />;
        if (tax_cart_display_price == 3) {
            price = (<View>
                <Text style={styles.itemStylePrice}>{Identify.__('Incl Tax') + ': '}<Format style={{ color: material.priceColor }} price={quoteItem.row_total_incl_tax} /></Text>
                <Text style={styles.itemStylePrice}>{Identify.__('Excl Tax') + ': '}<Format style={{ color: material.priceColor }} price={quoteItem.row_total} /></Text>
            </View>);
        } else if (tax_cart_display_price == 2) {
            price = <Format style={{ color: material.priceColor, fontSize: 16, fontFamily: material.fontBold, marginTop: 8 }} price={quoteItem.row_total_incl_tax} />
        } else {
            price = <Format style={{ color: material.priceColor, fontSize: 16, fontFamily: material.fontBold, marginTop: 8 }} price={quoteItem.row_total} />
        }
        return price;
    }

    function renderItemContent() {
        if (props.from === 'order_detail') {
            return (
                <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 8 }}>
                    <Text style={{ color: '#4F4F4F', marginBottom: 4 }}>{Identify.__('Saudi Ceramics')}</Text>
                    <Text numberOfLines={2} style={[styles.spaceLine, { color: '#4F4F4F' }]}>
                        {props.data.name}
                    </Text>
                    <View style={styles.viewFlex}>
                        {renderPrice(props.data)}
                        <View style={styles.viewFlexQty}>
                            <Text style={{ marginRight: 2, fontSize: 15 }}>{Identify.__('Qty:')}</Text>
                            <Text style={{ fontSize: 15 }}>{parseInt(props.data.qty.toString())}</Text>
                        </View>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={styles.view}>
                    <View style={[{ height: 125, paddingTop: 24, marginBottom: 8 }, props.data.in_group_product && props.data.in_group_product == '1' ?
                        {} : { borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }]}>
                        <Text numberOfLines={2} style={[styles.spaceLine, { color: '#4F4F4F', marginRight: 20 }]}>
                            {props.data.name}
                        </Text>
                        <QuoteItemView item={props.data} style={styles.itemStyle} />
                        <View style={styles.viewFlex}>
                            {renderPrice(props.data)}
                            <View style={styles.viewFlexQty}>
                                {/* <Text style={{ marginRight: 3, fontSize: 13 }}>{Identify.__('Qty')}</Text> */}
                                {renderQtyBox()}
                            </View>

                        </View>
                    </View>
                    {props.data.in_group_product && props.data.in_group_product == '1' ? null : <Text
                        onPress={() => props.parent.addProductToWishlist(props.data.product.entity_id, props.data.item_id)}
                        style={{ color: '#224299', textDecorationLine: 'underline', fontSize: 12, paddingBottom: 8, alignSelf: 'flex-end' }}
                    >{Identify.__('MOVE TO WISHLIST')}</Text>}
                    <TouchableOpacity style={{ position: 'absolute', top: 16, right: 12 }} onPress={() => showDeleteItemPopup(props.data)}>
                        <FastImage source={require('../../../img/icon_remove.png')} style={styles.icon} />
                    </TouchableOpacity>
                </View>
            );
        }
    }

    return (
        <View style={styles.container}>
            {renderImageItem()}
            {renderItemContent()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', backgroundColor: '#FFF', marginBottom: 16,
        borderWidth: 0.5, borderColor: '#D8D8D8', shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        }, shadowOpacity: 0.22, shadowRadius: 2.22, elevation: 3
    },
    view: { flex: 1, paddingHorizontal: 16, position: 'relative' },
    viewFlex: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    qtyBox: { borderStyle: 'solid', width: 45, height: 35, fontSize: 13, borderColor: '#BDBDBD', alignItems: 'center', borderWidth: 1, borderRadius: 4, textAlign: 'center', color: 'black' },
    spaceLine: { marginBottom: 5 },
    itemStyle: { marginBottom: 5, fontSize: material.textSizeSmall },
    itemStylePrice: {
        fontSize: material.textSizeSmall,
        textAlign: 'left', color: '#333333'
    },
    icon: { width: 24, height: 24 },
    viewFlexBody: { flexDirection: 'row' },
    viewFlexQty: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
    viewImage: { height: 125, width: 125 },
    viewFlexCoupon: { flex: 3, flexDirection: 'row', marginTop: 20, marginLeft: 15, marginRight: 10 },
});

export default QuoteItem