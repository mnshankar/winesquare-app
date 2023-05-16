import React from 'react';
import { Text, Button, View, Toast } from 'native-base';
import Identify from '@helper/Identify';
import Events from '@helper/config/events';
import material from '@theme/variables/material';
import Format from '../../../../core/screens/catalog/components/product/price/format';
import { connect } from 'react-redux';
const Place = (props) => {
    const { delivery = '' } = props.parent.state;
    let currency_symbol = Identify.getMerchantConfig().storeview.base.currency_symbol || Identify.getMerchantConfig().storeview.base.currency_code;
    let data = props.parent.props.data.order;

    return (
        <View style={[{
            position: 'absolute',
            bottom: 0,
            flex: 1, flexDirection: 'row',
            padding: 15, backgroundColor: 'white', alignItems: 'center'
        },
        material.isIphoneX ? { marginLeft: 15, marginRight: 15, bottom: 15 } : {}
        ]}>
            {data && data.total ? <Format price={data.total.grand_total_incl_tax}
                style={[{
                    color: Identify.theme.price_color, fontFamily: material.fontBold,
                    fontSize: 16, marginRight: 10
                }]}
                currency_symbol={currency_symbol} /> : null}
            <Button full style={{ flex: 1 }}
                onPress={() => {
                    if (props.delivery_instructions?.trim().length > 0) {
                        let data = {};
                        data['event'] = 'checkout_action';
                        data['action'] = 'clicked_place_order_button';
                        Events.dispatchEventAction(data, this);
                        props.parent.onPlaceOrder();
                    } else {
                        Toast.show({
                            text: Identify.__('Delivery instructions is required'),
                            type: "danger",
                            duration: 3000,
                            textStyle: { fontFamily: material.fontFamily }
                        });
                    }
                }}
            >
                <Text style={{ fontFamily: material.fontBold }}>{Identify.__('Continue')}</Text>
            </Button>
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        delivery_instructions: state.redux_data.delivery_instructions,
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Place);