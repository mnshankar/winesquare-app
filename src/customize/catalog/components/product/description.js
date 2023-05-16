import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Dimensions } from 'react-native';
import { Icon } from 'native-base';
import HTML from 'react-native-render-html';
import Identify from '@helper/Identify';
import styles from './styles';

const ProductDescriptionComponent = (props) => {

    const [open, setOpen] = useState(false)

    let showDescription = props.product.short_description;
    if (!showDescription) {
        showDescription = props.product.description;
    }
    if (!props.parent.state.reRender || !showDescription) {
        return null
    }
    console.log(showDescription)

    return (
        <View style={{ marginHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }}>
            <TouchableOpacity style={[styles.container, { marginTop: 20, marginBottom: 12 }]} onPress={() => setOpen(!open)}>
                <Text>{Identify.__('Product Information')}</Text>
                <Icon style={styles.extendIcon} name={open ? 'md-remove' : 'md-add'} />
            </TouchableOpacity>

            {open && <View style={{ paddingBottom: 12, alignItems: 'flex-start' }}><HTML html={showDescription} tagsStyles={{ p: { textAlign: 'left' }, span: { textAlign: 'left' } }} imagesMaxWidth={Dimensions.get('window').width} /></View>}
        </View>
    );
}

export default ProductDescriptionComponent;