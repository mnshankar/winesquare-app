import React from 'react';
import { Text, Icon, Card } from 'native-base';
import { TouchableOpacity, View, findNodeHandle } from 'react-native';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';
import SimiComponent from '@base/components/SimiComponent';
import Events from '@helper/config/events';

class ShippingMethod extends SimiComponent {

    constructor(props) {
        super(props);
        this.data = {};
        if (this.props.isPpexpress) {
            this.data = this.props.data;
        } else {
            this.data = this.props.parent.props.data.order.shipping;
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isPpexpress) {
            this.data = nextProps.data;
        } else {
            this.data = nextProps.parent.props.data.order.shipping;
        }
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    // scrollToShipping() {
    //     this.view.measureLayout(
    //         findNodeHandle(this.props.parent.scrollViewRef),
    //         (x, y) => {
    //             this.props.parent.scrollViewRef.scrollTo({ x: 0, y: y, animated: true });
    //         }
    //     );
    // }

    onSelectShippingMethod(shippingMethod) {
        let data = {};
        data['event'] = 'checkout_action';
        data['action'] = 'saved_shipping_method';
        Events.dispatchEventAction(data, this);
        this.props.parent.onSaveMethod({
            s_method: {
                method: shippingMethod.s_method_code
            }
        });
    }
    renderShippingItem(shippingMethod) {
        return (
            <TouchableOpacity key={shippingMethod.s_method_code} onPress={() => {
                this.onSelectShippingMethod(shippingMethod)
            }}>
                <View style={{ borderBottomWidth: 0, borderBottomColor: '#EDEDED', flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}>
                    <Icon style={{ marginTop: 2, fontSize: 18, color: shippingMethod.s_method_selected ? '#224299' : '#F2F2F2' }} name={shippingMethod.s_method_selected ? 'md-radio-button-on' : 'md-radio-button-off'} />
                    <View style={{ marginLeft: 10, flex: 1 }}>
                        <Text style={{ textAlign: 'left', color: '#4F4F4F' }}>{Identify.__(shippingMethod.s_method_title)}</Text>
                        {shippingMethod.s_method_name ? <Text style={{ fontSize: material.textSizeSmall, textAlign: 'left', color: '#4F4F4F' }}>{shippingMethod.s_method_name}</Text> : null}
                    </View>
                    <Text style={{ marginLeft: 10, color: shippingMethod.s_method_selected ? '#224299' : '#828282' }}>{Identify.formatPrice(shippingMethod.s_method_fee)}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    createItems() {
        let items = [];

        for (let i in this.data) {
            let shippingMethod = this.data[i];
            items.push(
                this.renderShippingItem(shippingMethod)
            );
        }
        return items;
    }

    renderPhoneLayout() {
        if (this.data.length == 0) {
            return null;
        }
        if (this.props.parent.isPayment) {
            return null;
        }
        return (
            <Card ref={ref => this.view = ref} style={{ margin: 10, width: '95%', alignSelf: 'center', padding: 10 }}>
                <Text style={{ fontFamily: material.fontBold, paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10, textAlign: 'left', fontSize: 16 }}>
                    {Identify.__(this.props.title)}
                </Text>
                {this.createItems()}
            </Card>
        );
    }
}

export default ShippingMethod;
