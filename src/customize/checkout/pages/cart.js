import React from 'react';
import { Container, Content, Text, View, Toast, Spinner, StyleProvider } from 'native-base';
import { Image, Keyboard, RefreshControl, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import md5 from 'md5';
import SimiPageComponent from "@base/components/SimiPageComponent";
import NewConnection from "@base/network/NewConnection";
import { quoteitems } from '@helper/constants';
import Identify from '@helper/Identify';
import variable from "@theme/variables/material";
import { connect } from 'react-redux';
import Layout from '@helper/config/layout';
import Events from '@helper/config/events';
import material from '@theme/variables/material';
import { wishlist_item } from '../../../plugins/constants'
import NavigationManager from '@helper/NavigationManager';
import getTheme from '@theme/components/index';
import { NetworkApp } from "../../../core/base/components/layout/config";
import { HeaderApp } from '../../../core/base/components/layout/config';
import SimiContext from '../../../core/base/components/SimiContext';
import FastImage from 'react-native-fast-image'
import AppStorage from '@helper/storage';
class Cart extends SimiPageComponent {
    constructor(props) {
        super(props);
        this.from = 'cart';
        this.state = {
            ...this.state,
            refreshing: false,
        };
        this.list = null;
        this.totals = null;
        this.useDiffLayoutForHorizontal = true;
        this.is_go_detail = true;
        this.isRight = true;
        if (this.props.data) {
            this.dataTracking = {
                quoteitems: this.props.data
            }
        }
        this.wishlistId = null;
        // this.isBack = false;
        this.hanleDeliveryInstructions = this.hanleDeliveryInstructions.bind(this);
    }

    hanleDeliveryInstructions(text) {
        this.props.storeData('delivery_instructions', text);
        Toast.show({
            text: Identify.__('Delivery instructions is successfully added.'),
            type: 'success',
            duration: 2000,
            textStyle: { fontFamily: material.fontFamily }
        });
    }

    renderLayout(content, position = null) {
        this.list = this.props.data.quoteitems.length > 0 ? this.props.data.quoteitems : null;
        this.totals = this.props.data.total;
        let contents = Layout.layout.cart_layout[content];
        let components = [];
        for (let i = 0; i < contents.length; i++) {
            let element = contents[i];
            if (element.active == true) {
                let key = md5(content + "_cart" + i);
                if (position == 'left') {
                    if (element.left) {
                        let Content = element.content;
                        components.push(<Content
                            parent={this}
                            navigation={this.props.navigation}
                            key={key}
                            {...element.data}
                        />);
                    }
                } else if (position == 'right') {
                    if (!element.left) {
                        let Content = element.content;
                        components.push(<Content
                            parent={this}
                            navigation={this.props.navigation}
                            key={key}
                            {...element.data}
                        />);
                    }
                } else {
                    let Content = element.content;
                    components.push(<Content
                        parent={this}
                        navigation={this.props.navigation}
                        key={key}
                        {...element.data}
                    />);
                }
            }
        };
        return components;
    }
    componentWillMount() {
        if (this.props.loading.type === 'none') {
            if (Identify.isEmpty(this.props.data) || Identify.TRUE(this.props.data.reload_data)) {
                this.props.storeData('showLoading', { type: 'full' });
            }
        }
        this.props.navigation.addListener(
            'willFocus',
            () => {
                if (Identify.TRUE(this.props.data.reload_data)) {
                    this.requestCart()
                }
            }
        )
    }
    componentDidMount() {
        super.componentDidMount();
        AppStorage.getData('delivery_instructions').then((text) => {
            this.setState({
                delivery: text
            })
        });
        if (Identify.isEmpty(this.props.data) || Identify.TRUE(this.props.data.reload_data)) {
            this.requestCart()
        } else {
            if (this.props.data.message && !Identify.TRUE(this.props.data.is_can_checkout)) {
                let messages = this.props.data.message;
                let message = messages[0];
                Keyboard.dismiss();
                Toast.show({
                    text: Identify.__(message),
                    duration: 3000,
                    textStyle: { fontFamily: material.fontFamily }
                });
            }
        }
    }

    requestCart() {
        newConnection = new NewConnection();
        newConnection.init(quoteitems, 'get_quoteitems', this);
        newConnection.connect();
    }

    addProductToWishlist(id, item_id) {
        this.props.storeData('showLoading', { type: 'dialog' });
        new NewConnection()
            .init(wishlist_item, 'add_to_wishlist', this, 'POST')
            .addBodyData({ "product": id, "qty": "1" })
            .connect();
        this.wishlistId = item_id;
    }

    setData(data, requestId) {
        if (requestId == 'add_to_wishlist') {
            Toast.show({
                text: Identify.__('Add Wishlist Successfully'),
                duration: 3000,
                type: 'success'
            });
            this.updateCart(this.wishlistId, 0)
        } else {
            data['reload_data'] = true;
            this.dataTracking = {
                quoteitems: data
            }
            this.props.storeData('actions', [
                { type: 'showLoading', data: { type: 'none' } },
                { type: 'quoteitems', data: data }
            ]);
            if (data.message) {
                let messages = data.message;
                let message = messages[0];
                Keyboard.dismiss();
                Toast.show({
                    text: Identify.__(message),
                    duration: 3000
                });
            }
        }
    }
    qtyHandle(e) { return; }
    updateCart(item_id, qty) {
        this.props.storeData('showLoading', { type: 'dialog' });
        let json = {};
        json[item_id] = qty;
        let data = {};
        data['event'] = 'cart_action';
        data['action'] = 'update_cart';
        data['item_id'] = item_id;
        data['qty'] = qty;
        Events.dispatchEventAction(data, this);

        new NewConnection()
            .init(quoteitems, 'update_item', this, 'PUT')
            .addBodyData(json)
            .connect();
    }

    qtySubmit(e, item_id, default_qty) {
        if (e.nativeEvent.text && e.nativeEvent.text != default_qty.toString()) {
            this.updateCart(item_id, e.nativeEvent.text);
        } else {
            e.nativeEvent.text = default_qty.toString();
        }
    }
    refreshControl() {
        return (
            <RefreshControl
                refreshing={this.state.refreshing}
                tintColor={variable.defaultSpinnerColor}
                onRefresh={() => this.refreshListView()} />
        )
    }
    refreshListView() {
        //Start Rendering Spinner
        this.setState({ refreshing: true });
        new NewConnection()
            .init(quoteitems, 'refresh_quoteitems', this)
            .connect();
        this.props.storeData('showLoading', { type: 'full' });
        this.setState({ refreshing: false }); //Stop Rendering Spinner
    }
    renderPhoneLayout() {
        if (Identify.isEmpty(this.props.data) || this.props.data.quoteitems.length <= 0) {
            return (
                <Container style={{ backgroundColor: variable.appBackground }}>
                    <Content style={{ flex: 1 }} refreshControl={this.refreshControl()}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 160 }}>
                            <FastImage source={require('../../img/empty-cart.png')} style={{ width: 100, height: 100, resizeMode: 'contain' }} />
                            <TouchableOpacity style={{ padding: 10, backgroundColor: '#224299', marginTop: 15 }}
                                onPress={() => NavigationManager.backToRootPage(this.props.navigation)}
                            >
                                <Text style={{ fontFamily: material.fontBold, color: 'white' }}>{Identify.__('Continue Shopping')}</Text>
                            </TouchableOpacity>
                        </View>
                    </Content>
                </Container >
            );
        }
        let isCanCheckout = this.props.data.is_can_checkout && this.props.data.is_can_checkout == '1';
        return (
            <Container style={{ position: 'relative', backgroundColor: variable.appBackground }}>
                <Content refreshControl={this.refreshControl()} style={isCanCheckout ? { marginBottom: material.isIphoneX ? 50 : 30, paddingBottom: 60 } : {}}>
                    <View style={{ paddingBottom: 60 }}>
                        {this.renderLayout('content')}
                    </View>
                </Content>
                {this.renderLayout('container')}
            </Container>
        )
    }
    renderTabletHorizontalLayout() {
        if (Identify.isEmpty(this.props.data) || this.props.data.quoteitems.length <= 0) {
            return (
                <Container style={{ backgroundColor: variable.appBackground }}>
                    <Content refreshControl={this.refreshControl()}>
                        <Text style={{ textAlign: 'center', marginTop: 90 }}>{Identify.__('You have no items in your shopping cart')}</Text>
                    </Content>
                </Container>
            );
        }
        return (
            <KeyboardAvoidingView behavior={'padding'}
                style={{ flex: 1 }}>
                <Container style={{ flex: 3, flexDirection: 'row', backgroundColor: variable.appBackground }}>
                    <View style={{ flex: 2 }}>
                        <Content refreshControl={this.refreshControl()}>
                            {this.renderLayout('content', 'left')}
                        </Content>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Content>
                            {this.renderLayout('content', 'right')}
                        </Content>
                        {this.renderLayout('container')}
                    </View>
                </Container>
            </KeyboardAvoidingView>
        );
    }

    // render() {
    //     return (
    //         <SimiContext.Provider value={{ parent: this, ...this.addContextToConsumer() }}>
    //             <StyleProvider style={getTheme(material)}>
    //                 <Container>
    //                     <NetworkApp />
    //                     <HeaderApp
    //                         obj={this}
    //                         navigation={this.props.navigation}
    //                         back={this.isBack}
    //                         showSearch={this.showSearch}
    //                         show_right={this.isRight}
    //                         title={this.title}
    //                         from={this.from}
    //                         show_menu={this.isMenu}
    //                         backAction={this.backAction} />
    //                     {this.dispatchEventPage()}
    //                     <View style={{ flex: 1, backgroundColor: material.appBackground }}>
    //                         {this.createLayout()}
    //                         {this.state.showLoading != 'none' &&
    //                             <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: this.state.showLoading == 'full' ? 'white' : '#00000033', alignItems: 'center', justifyContent: 'center' }}>
    //                                 <Spinner color={this.loadingColor} />
    //                             </View>}
    //                     </View>
    //                     {this.dispatchPlugin('footer_app')}
    //                 </Container>
    //             </StyleProvider>
    //         </SimiContext.Provider>
    //     );
    // }
}

const mapStateToProps = (state) => {
    return {
        loading: state.redux_data.showLoading,
        data: state.redux_data.quoteitems,
        customer_data: state.redux_data.customer_data,
        delivery_instructions: state.redux_data.delivery_instructions,
    };
}
//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
