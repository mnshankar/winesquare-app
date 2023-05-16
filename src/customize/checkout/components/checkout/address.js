import React from 'react';
import { View, Icon, ListItem, Left, Body, Text } from 'native-base';
import NavigationManager from '@helper/NavigationManager';
import { checkout_mode, address_detail_mode, address_book_mode } from "@helper/constants";
import material from '@theme/variables/material';
import Events from '@helper/config/events';
import Identify from '@helper/Identify';
import { TouchableOpacity } from 'react-native';

const AddressCheckout = (props) => {
    data = null;
    function onEditAddress(addressData) {
        let data = {};
        data['event'] = 'checkout_action';
        data['action'] = 'edited_address';
        Events.dispatchEventAction(data, this);
        switch (props.parent.mode) {
            case checkout_mode.exist_customer:
                routeName = 'AddressBook';
                params = {
                    mode: (props.title == 'Shipping Address') ? address_book_mode.checkout.edit_shipping : address_book_mode.checkout.edit_billing,
                    onSaveShippingAddress: props.parent.onSaveShippingAddress,
                    onSaveBillingAddress: props.parent.onSaveBillingAddress,
                };
                break;
            case checkout_mode.new_customer:
                routeName = 'NewAddress';
                params = {
                    mode: (props.title == 'Shipping Address') ? address_detail_mode.checkout.as_new_customer.edit_shipping : address_detail_mode.checkout.as_new_customer.edit_billing,
                    onSaveShippingAddress: props.parent.onSaveShippingAddress,
                    onSaveBillingAddress: props.parent.onSaveBillingAddress,
                    address: addressData
                };
                break;
            case checkout_mode.guest:
                routeName = 'NewAddress';
                params = {
                    mode: (props.title == 'Shipping Address') ? address_detail_mode.checkout.as_guest.edit_shipping : address_detail_mode.checkout.as_guest.edit_billing,
                    onSaveShippingAddress: props.parent.onSaveShippingAddress,
                    onSaveBillingAddress: props.parent.onSaveBillingAddress,
                    address: addressData
                };
                break;
            default:
                break;
        }
        if (routeName) {
            NavigationManager.openPage(props.navigation, routeName, params);
        }
    }

    function renderAddressItem(iconName, textDisplay, hasComma = false, lineBreak = false, breakPosition) {
        let text = textDisplay;
        if (textDisplay.length > 1) {
            text = textDisplay.map((txt, i) => {
                if (hasComma) {
                    if (i === textDisplay.length - 1) {
                        return txt
                    } else if (lineBreak === true && i === breakPosition) {
                        return <Text key={i} style={{ fontSize: material.textSizeSmall, textAlign: 'left', color:'#4F4F4F' }}>{txt}{"\n"}</Text>
                    } else {
                        if (txt === null) {
                            return '';
                        } else {
                            return txt + ', '
                        }
                    }
                } else {
                    return txt + ' '
                }
            })
        }

        return (
            <ListItem icon noBorder style={{ height: null }}>
                {/* <Left>
                    <Icon name={iconName} />
                </Left> */}
                <Body style={{ height: null }}>
                    <Text style={[{ fontSize: material.textSizeSmall, textAlign: 'left', color:'#4F4F4F' }, iconName == 'md-person' ? { fontFamily: material.fontBold, marginBottom: 4 } : {}]}>{text}</Text>
                </Body>
            </ListItem>
        )
    }

    let title = props.title;
    if (title == "Shipping Address") {
        data = props.parent.props.data.order.shipping_address;
    } else if (title == "Billing Address") {
        data = props.parent.props.data.order.billing_address;
    } else {
        data = props.data;
    }

    function checkVirtual() {
        let list = props.list ? props.list : props.parent.list;
        let isVirtual = true;
        if (list && list.length > 0) {
            for (let i in list) {
                if (!list[i]['is_virtual'] || !Identify.TRUE(list[i]['is_virtual'])) {
                    isVirtual = false;
                    break;
                }
            }
        }
        return isVirtual;
    }

    if (title == "Shipping Address" && checkVirtual()) {
        return null;
    }

    function checkShowEdit() {
        if (props.hasOwnProperty('showEdit')) {
            return props.showEdit;
        }
        if ((title == 'Billing Address' && props.parent.mode == checkout_mode.new_customer)) {
            return false;
        }
        return true;
    }

    if (props.parent.isPayment && title == 'Shipping Address') {
        return null;
    } else if (!props.parent.isPayment && title == 'Billing Address') {
        return null;
    }

    return (
        <View>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10 }}>
                <Text style={{ fontSize: 18, width: '100%', textAlign: 'left', color:'#333333' }}>{Identify.__(title)}</Text>
                {/* {checkShowEdit() && <Icon style={{ marginLeft: 5, fontSize: 20 }} name="md-settings" onPress={() => {
                    onEditAddress(data);
                }} />} */}
            </View>
            <View style={{ width: '94%', alignSelf: 'center', backgroundColor: '#E0E0E0', height: 1, marginBottom: 10 }} />
            {renderAddressItem("md-person", [data.firstname, data.lastname])}
            {renderAddressItem("md-locate", [data.street, data.city, data.region, data.postcode, data.country_name], true, true, 0)}
            {data.telephone && renderAddressItem("md-call", [data.telephone])}
            {/* {data.email && renderAddressItem("md-mail", [data.email])} */}
            {checkShowEdit() ? <TouchableOpacity onPress={() => {
                onEditAddress(data);
            }}
                style={{ padding: 10, margin: 10, backgroundColor: '#ECEEF5', width: '50%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: material.fontBold, color: '#224299', fontSize: 14 }}>{Identify.__('Change or Add Address')}</Text>
            </TouchableOpacity> : null}
        </View>
    );
}

export default AddressCheckout;
