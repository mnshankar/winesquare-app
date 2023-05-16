import React from 'react';
import { FlatList } from 'react-native';
import { View, Text } from 'native-base';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';
import QuoteItem from './item';

const ListItems = (props) => {

    function generatePropsFlatlist(list) {
        return {
            data: list,
            extraData: props.parent.list,
            showsVerticalScrollIndicator: false
        }
    }

    function renderItem(item) {
        return (
            <QuoteItem data={item} parent={props.parent} from={props.from} />
        );
    }

    let list = props.list ? props.list : props.parent.list;
    if (list) {
        return (
            <View style={props.from == 'order_detail' ? {} : { marginLeft: 15, marginRight: 15 }}>
                {props.from == 'checkout' && <Text style={{ fontFamily: material.fontBold, width: '100%', backgroundColor: material.sectionColor, paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10, textAlign: 'left' }}>{Identify.__('Shipment Details')}</Text>}
                <FlatList
                    {...generatePropsFlatlist(list)}
                    keyExtractor={(item) => item.item_id}
                    renderItem={({ item }) =>
                        renderItem(item)
                    } />
            </View>
        );
    }
    return null;
}

ListItems.defaultProps = {
    is_go_detail: false,
    from: null
};

export default ListItems;
