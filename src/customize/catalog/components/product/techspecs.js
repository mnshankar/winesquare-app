import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'native-base';
import HTML from 'react-native-render-html'
import Identify from '@helper/Identify';
import Events from '@helper/config/events';
import styles from './styles';

const ProductTechSpecsComponent = (props) => {

    const [open, setOpen] = useState(false)

    function openTeachSpecs() {
        let params = {};
        params['event'] = 'product_action';
        params['action'] = 'selected_product_tech_specs';
        params['product_name'] = props.product.name;
        params['product_id'] = props.product.entity_id;
        params['sku'] = props.product.sku;
        Events.dispatchEventAction(params, this);

        setOpen(true)
    }

    createContent = () => {
        let rows = [];
        let additional = props.product.additional
        let shouldHightlight = true;
        for (let key in additional) {
            let item = additional[key];
            rows.push(
                <View key={key} style={{ backgroundColor: (shouldHightlight) ? '#EDEDED' : 'white', flexDirection: 'row', paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10 }}>
                    {renderContent(item.label, { flex: 2, fontSize: 12, textAlign: 'left' })}
                    {renderContent(item.value, { flex: 3, fontSize: 12, marginLeft: 16, textAlign: 'left' })}
                </View>
            );
            shouldHightlight = !shouldHightlight;
        }
        return (rows);
    }

    renderContent = (data, style) => {
        let styleContent = style;
        if (data.includes('<')) {
            delete styleContent['textAlign']
            return <HTML containerStyle={styleContent} tagsStyles={{ p: { textAlign: 'left' }, span: { textAlign: 'left' } }} html={data} baseFontStyle={{ fontFamily: material.fontFamily }} />
        } else {
            return <Text style={styleContent}>{Identify.__(data)}</Text>
        }
    }

    if (!Identify.isEmpty(props.product.additional)) {
        return (
            <View style={{ marginHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }}>
                <TouchableOpacity
                    style={[styles.container, { marginTop: 20, marginBottom: 12 }]}
                    onPress={() => {
                        if (open) {
                            setOpen(false)
                        } else openTeachSpecs()
                    }}
                >
                    <Text>{Identify.__('Specifications')}</Text>
                    <Icon style={styles.extendIcon} name={open ? 'md-remove' : 'md-add'} />
                </TouchableOpacity>

                {open ? createContent() : null}
            </View>
        );
    } else {
        return (null);
    }
}
export default ProductTechSpecsComponent;