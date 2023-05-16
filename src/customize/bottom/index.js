import React from 'react';
import { Dimensions } from 'react-native';
import { View } from "native-base";
import { connect } from 'react-redux';
import Identify from '@helper/Identify';
import material from "@theme/variables/material";
import ItemBottomMenu from "./item";

class Bottom extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            current_screen: ''
        }
    }

    //..
    initData() {
        let listItemBottoms = [];

        //add home
        listItemBottoms.push({
            active: true,
            key: 'home_bottom',
            route_name: "Home",
            icon: require('../img/home.png'),
            title: Identify.__('Home')
        });

        listItemBottoms.push({
            active: true,
            key: 'root_cate',
            route_name: "Category",
            icon: require('../img/cate.png'),
            title: Identify.__('Category')
        });
        listItemBottoms.push({
            active: true,
            key: 'account_bottom',
            route_name: "MyAccount",
            icon: require('../img/account.png'),
            title: Identify.__('My Account'),
        });
        listItemBottoms.push({
            active: true,
            key: 'cart_bottom',
            route_name: "Cart",
            icon: require('../img/cart.png'),
            title: Identify.__('Cart'),
        });

        return listItemBottoms;
    }

    renderView() {
        let items = this.initData();
        let renderItems = [];
        items.map((item, index) => {
            renderItems.push(
                <ItemBottomMenu
                    key={index}
                    data={item}
                    navigation={this.props.navigation}
                    current_screen={this.props.navigation.state.routeName}
                    quoteitems={this.props.quoteitems}
                    customer_data={this.props.customer_data}
                />
            )
        })
        return renderItems;
    }


    renderBottomMenu() {
        let routeName = this.props.navigation.state.routeName;

        if (routeName == 'Checkout') {
            return null
        }

        return (
            <View style={{
                flexDirection: 'row',
                height: material.isIphoneX ? 76 : 56,
                paddingBottom: material.isIphoneX ? 15 : 0,
                backgroundColor: 'white', justifyContent: 'center',
                shadowColor: "#000000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                zIndex: 100
            }}>
                {this.renderView()}
            </View>
        );
    }

    render() {
        return (
            <View>
                {this.renderBottomMenu()}
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.redux_data.customize_show_noti_success,
        customer_data: state.redux_data.customer_data,
        redux_data: state.redux_data,
        quoteitems: state.redux_data.quoteitems
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

export default connect(mapStateToProps, mapDispatchToProps)(Bottom);