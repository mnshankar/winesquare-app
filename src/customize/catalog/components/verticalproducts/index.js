import React from 'react';
import { ScrollView, FlatList, TouchableOpacity, Dimensions, Keyboard, Modal, KeyboardAvoidingView, LayoutAnimation, Platform } from 'react-native';
import { Spinner, View, Text, Toast, CardItem, Icon } from 'native-base';
import Device from '@helper/device';
import Identify from '@helper/Identify';
import VerticalProductItem from './item';
import SimiComponent from '@base/components/SimiComponent';
import styles from './styles';
import material from '../../../../../native-base-theme/variables/material';
import FastImage from 'react-native-fast-image'
import OutStockLabel from '../../../../core/screens/catalog/components/product/outStockLabel';
import Price from '../../../../core/screens/catalog/components/product/price';
import { TextInput } from 'react-native';
import { quoteitems } from '@helper/constants';
import AppStorage from '@helper/storage';
import { connect } from 'react-redux';
import NewConnection from '@base/network/NewConnection';
import NavigationManager from '@helper/NavigationManager';

class VerticalProducts extends SimiComponent {
    constructor(props) {
        super(props);
        this.heightDefault = (Dimensions.get("window").height / 2) > 450 ? 450 : (Dimensions.get("window").height / 2) + 50;
        this.height = Dimensions.get("window").height;
        this.width = Dimensions.get("window").width;
        this.state = {
            modalVisible: false,
            productModal: null,
            productModalQty: "1",
            height: this.heightDefault,
            marginTop: this.height - this.heightDefault,
        }
        this.selectedProductModal = this.selectedProductModal.bind(this);
    }

    componentDidMount() {
        if (!this.props.parent.no_toast) {
            Toast.show({
                text: this.props.parent.state.data.total + ' ' + Identify.__('Product') + '(' + Identify.__('s') + ')',
                duration: 3000,
                textStyle: { textAlign: "center", fontFamily: material.fontFamily },
            })
        }
        if (Platform.OS == 'android') {
            this.keyboardDidShowSubscription = Keyboard.addListener(
                'keyboardDidShow',
                (e) => {
                    this.setState({
                        height: this.heightDefault,
                        marginTop: this.height - this.heightDefault - e.endCoordinates.height,
                    });
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                },
            );
            this.keyboardDidHideSubscription = Keyboard.addListener(
                'keyboardDidHide',
                (e) => {
                    this.setState({
                        height: this.heightDefault,
                        marginTop: this.height - this.heightDefault,
                    });
                },
            );
        }
    }

    componentWillMount() {
        if (Platform.OS == 'android') {
            this.keyboardDidShowSubscription?.remove();
            this.keyboardDidHideSubscription?.remove();
        } else {
            this.keyboardWillShowListener = Keyboard.addListener(
                "keyboardWillShow",
                this.keyboardWillShow.bind(this)
            );
        }

    }

    keyboardWillShow(e) {
        this.setState({
            height: this.heightDefault,
            marginTop: this.height - this.heightDefault - e.endCoordinates.height,
        });
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    selectedProductModal(product) {
        if (product?.app_prices && product?.app_prices?.low_price) {
            this.heightDefault = (Dimensions.get("window").height / 2) > 450 ? 450 : (Dimensions.get("window").height / 2) + 70;
        } else {
            this.heightDefault = (Dimensions.get("window").height / 2) > 450 ? 450 : (Dimensions.get("window").height / 2) + 50;
        }
        if (Device.isTablet() && Dimensions.get("window").height < Dimensions.get("window").width) {
            this.heightDefault = Dimensions.get("window").height * 0.7;
        }
        this.setState({
            productModal: product,
            modalVisible: true,
            productModalQty: "1",
            height: this.heightDefault,
            marginTop: Dimensions.get("window").height - this.heightDefault,
        })
    }

    formatData = (data, numColumns) => {
        let numOfFullRow = Math.floor(data.length / numColumns);
        let numOfItemOnLastRow = data.length - numOfFullRow * numColumns;
        while (numOfItemOnLastRow !== numColumns && numOfItemOnLastRow !== 0) {
            ///remove this sec if don't have loadMore
            if (this.props.parent.state.loadMore) {
                for (let i = 0; i < data.length - 1; i++) {
                    if (data[i].empty) {
                        data.splice(i, 1);
                    }
                }
            }
            ///
            data.push({ entity_id: Identify.makeid(), empty: true, app_prices: { has_special_price: null } })
            numOfItemOnLastRow = numOfItemOnLastRow + 1;
        }
        return data;
    }

    renderItem(item, index) {
        return (<VerticalProductItem
            layout={this.props.parent.layout}
            product={item}
            navigation={this.props.navigation}
            showList={this.props.parent.state.showList}
            itemStyle={{ flex: 1 }}
            index={index}
            selectedProductModal={this.selectedProductModal}
        />);
    }

    renderOutStock() {
        if (this.state.productModal && this.state.productModal?.is_salable == '0' || this.state.productModal?.is_salable === null) {
            return <OutStockLabel />
        }
    }

    createListProps() {
        let showList = this.props.parent.state.showList;
        let numColumns = (showList) ? 1 : ((!showList && Device.isTablet()) ? 4 : 2)
        return {
            style: styles.verticalList,
            data: this.formatData(this.props.products, numColumns),
            extraData: this.props.parent.state.data,
            showsVerticalScrollIndicator: false,
            keyExtractor: (item) => item.entity_id,
            numColumns: numColumns,
            key: (showList) ? 'ONE COLUMN' : 'TWO COLUMN'
        };
    }

    onAddToCart() {
        let params = {};

        params['product'] = this.state.productModal.entity_id.toString();
        params['qty'] = this.state.productModalQty.toString();
        this.setState({
            modalVisible: false,
        })
        this.props.storeData('showLoading', { type: 'dialog' });
        newConnection = new NewConnection();
        newConnection.init(quoteitems, 'add_to_cart', this, 'POST');
        newConnection.addBodyData(params);
        newConnection.connect();
    }

    handleWhenRequestFail() {
        this.props.storeData('showLoading', { type: 'none' });
    }

    setData(data, requestID) {
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
    }

    renderImage() {
        let source = (this.state.productModal && this.state.productModal.images && this.state.productModal.images.length > 0) ? { uri: this.state.productModal.images[0].url } : require('@media/logo.png');
        let heightImage = Device.isTablet() && Dimensions.get("window").height < Dimensions.get("window").width ? 200 : Device.isTablet() ? 250 : (this.height / 2) < 450 ? 120 : 150;
        return (
            <View style={{ position: 'relative', }}>
                {
                    Platform.OS == 'android' ? (
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    modalVisible: false,
                                })
                            }}
                        >
                            <View style={{ padding: 3, justifyContent: 'flex-end', flexDirection: 'row' }}>
                                <Icon type='AntDesign' name="close" style={{ fontSize: 20 }} />
                            </View>
                        </TouchableOpacity>
                    ) : null
                }
                <CardItem cardBody style={{ position: 'relative' }}>
                    <View style={[{ justifyContent: 'center', alignItems: 'center', width: "100%", position: 'relative' }]}>
                        <TouchableOpacity
                            onPress={() => {
                                if (this.state.productModal) {
                                    this.setState({
                                        modalVisible: false,
                                    })
                                    NavigationManager.openPage(this.props.navigation, 'ProductDetail', {
                                        productId: this.state.productModal.entity_id
                                    })
                                }

                            }}
                        >
                            {/* {this.renderSpecialPriceLabel()} */}
                            <FastImage resizeMode={FastImage.resizeMode.contain} source={source}
                                style={{
                                    width: heightImage,
                                    height: heightImage,
                                    overflow: 'hidden',
                                    margin: 4,
                                    borderRadius: 5
                                }}
                            />
                            <View style={{ position: 'absolute', right: 5, bottom: 0 }}>
                                {this.renderOutStock()}
                            </View>
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.productModal?.additional?.wine_point?.value ? this.renderWinePoints() : null
                    }
                </CardItem>

            </View>
        )
    }
    checkTypeIdAndPrice() {
        if (this.state.productModal && this.state.productModal.type_id === 'configurable' && this.state.productModal.app_prices && this.state.productModal.app_prices.price == 0) {
            return false;
        }
        return true;
    }

    renderWinePoints() {
        if (this.state.productModal?.additional?.wine_point?.value) {
            return (
                <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: "red", borderRadius: 9999, width: 45, height: 45, flexDirection: 'row', justifyContent: "center", alignItems: "center", zIndex: 999 }}>
                    <Text style={{ color: "white", textAlign: "center" }}>
                        {this.state.productModal?.additional?.wine_point?.value}
                    </Text>
                </View>
            )
        }
        return null;
    }

    renderPrice() {
        if (this.state.productModal && this.checkTypeIdAndPrice()) {
            return (
                <Price
                    type={this.state.productModal.type_id}
                    prices={this.state.productModal.app_prices}
                    tierPrice={this.state.productModal.app_tier_prices}
                    styleDiscount={{ fontSize: 1 }}
                    navigation={this.props.navigation}
                    stylePrice={{ color: Identify.theme.button_background, fontWeight: "bold", fontSize: 16 }}
                    styleSpecialPrice={{ color: Identify.theme.button_background, fontWeight: "bold", fontSize: 16 }}
                    styleLabel={{ fontSize: 16, marginRight: 3 }}
                />
            )
        }
    }

    renderPhoneLayout() {
        let showLoadMore = this.props.parent.state.loadMore;
        let showList = this.props.parent.state.showList;
        let sortDown = this.props.parent.state.sortDown;
        let showContent = this.props.parent.state.showContent;
        let checkStock = this.state.productModal && this.state.productModal?.is_salable == '0' || this.state.productModal?.is_salable === null ? true : false;
        if (this.props.products.length === 0) {
            return (
                <Text style={{ textAlign: 'center', fontFamily: material.fontBold, marginTop: 30 }}>{Identify.__('There are no products matching the selection')}</Text>
            )
        } else {
            return (
                <>
                    {showContent ?
                        (<View style={{ flexDirection: 'row', paddingVertical: 16, paddingHorizontal: 20, justifyContent: 'space-between' }}>
                            {sortDown ?
                                <TouchableOpacity s tyle={{ textAlign: 'left', width: '50%' }} onPress={() => {
                                    this.props.parent.onSortAction('position', 'desc');
                                }}>
                                    <FastImage source={require('../../../img/icon_sort_down.png')} style={{ width: 24, height: 24 }} />
                                </TouchableOpacity> :
                                <TouchableOpacity style={{ textAlign: 'left', width: '50%' }} onPress={() => {
                                    this.props.parent.onSortAction('position', 'asc');
                                }}>
                                    <FastImage source={require('../../../img/icon_sort_up.png')} style={{ width: 24, height: 24 }} />
                                </TouchableOpacity>}
                            <TouchableOpacity style={{ textAlign: 'right', width: '50%' }} onPress={this.props.parent.changeStyle}>
                                {showList
                                    ? <FastImage source={require('../../../img/icon_grid.png')} style={{ width: 20, height: 20, alignSelf: 'flex-end' }} />
                                    : <FastImage source={require('../../../img/icon_list.png')} style={{ width: 20, height: 20, alignSelf: 'flex-end' }} />
                                }
                            </TouchableOpacity>
                        </View>) : null}
                    <ScrollView
                        scrollEventThrottle={400}
                        showsVerticalScrollIndicator={false}
                        onScroll={this.props.parent.onListScroll}
                    >
                        <FlatList
                            {...this.createListProps()}
                            renderItem={({ item, index }) => {
                                if (item.empty) {
                                    return <View style={{ flex: 1 }} />
                                }
                                return (
                                    this.renderItem(item, index)
                                );
                            }
                            }
                            style={{ backgroundColor: this?.props?.products?.length > 2 ? "#efefef" : "white" }}
                        />
                        <Spinner color={Identify.theme.loading_color} style={(showLoadMore) ? {} : { display: 'none' }} />
                    </ScrollView>
                    <Modal
                        animationType="slide"
                        transparent={true}

                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            this.setState({
                                modalVisible: false,
                            })
                        }}
                        style={{ width: Dimensions.get("window").width, height: Dimensions.get("window").height }}
                    >
                        <KeyboardAvoidingView behavior={'padding'}>
                            <View style={{ position: 'relative', width: Dimensions.get("window").width, height: Dimensions.get("window").height, }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            modalVisible: false,
                                        })
                                    }}
                                >
                                    <View style={{ width: Dimensions.get("window").width, height: Dimensions.get("window").height, backgroundColor: Identify.theme.button_background, opacity: 0.1, position: 'absolute', top: 0, left: 0, right: 0 }} />
                                </TouchableOpacity>

                                <View style={{
                                    height: Device.isTablet() && Dimensions.get("window").height < Dimensions.get("window").width ? this.state.height : Device.isTablet() ? this.state.height + 200 : this.state.height, width: Dimensions.get("window").width, backgroundColor: "white", zIndex: 99,
                                    marginTop: Device.isTablet() && Dimensions.get("window").height < Dimensions.get("window").width ? this.state.marginTop : Device.isTablet() ? this.state.marginTop - 200 : this.state.marginTop, borderTopRightRadius: 15, borderTopLeftRadius: 15
                                }}>
                                    <View style={{ flex: 1, borderTopRightRadius: 15, borderTopLeftRadius: 15, backgroundColor: "white", padding: 10, position: 'relative', borderWidth: 1, borderColor: "#e0e0e0", justifyContent: 'space-between', paddingBottom: 20 }}>
                                        <View style={{ position: 'relative' }}>
                                            {this.renderImage()}
                                        </View>
                                        <View style={{ width: '100%', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', position: 'relative' }}>
                                            <View style={{ paddingHorizontal: 10, justifyContent: 'space-between' }}>
                                                <TouchableOpacity onPress={() => {
                                                    if (this.state.productModal) {
                                                        this.setState({
                                                            modalVisible: false,
                                                        })
                                                        NavigationManager.openPage(this.props.navigation, 'ProductDetail', {
                                                            productId: this.state.productModal.entity_id
                                                        })
                                                    }
                                                }}>
                                                    <Text style={{ fontSize: 16 }} numberOfLines={2}>{this.state.productModal && this.state.productModal?.name}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={{ paddingHorizontal: 10, }}>
                                            {this.renderPrice()}
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: (this.height / 2) < 450 ? 5 : 10 }}>
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
                                                    returnKeyType='done'
                                                    returnKeyLabel='done'
                                                    value={this.state.productModalQty.toString()}
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
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.onAddToCart();
                                            }}
                                            disabled={checkStock}
                                        >
                                            <View style={{ marginHorizontal: (this.height / 2) < 450 ? 5 : 10, marginBottom: 5, height: 40, backgroundColor: checkStock ? '#828282' : Identify.theme.button_background, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                                                    {
                                                        checkStock ? Identify.__('Out of Stock') :
                                                            Identify.__('Add to cart')
                                                    }
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        </KeyboardAvoidingView>
                    </Modal >
                </>
            );
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(VerticalProducts);