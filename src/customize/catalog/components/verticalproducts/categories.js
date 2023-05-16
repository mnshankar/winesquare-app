import React from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import NavigationManager from '@helper/NavigationManager';
import styles from './styles'
import FastImage from 'react-native-fast-image'
const Categories = (props) => {

    const onPressItem = (item) => {
        let routeName = 'Products';
        let params = {
            categoryId: item.entity_id,
            categoryName: item.name
        };
        NavigationManager.openPage(props.navigation, routeName, params);
    }

    const renderItems = ({ item }) => (
        <TouchableOpacity style={styles.itemCate} onPress={() => onPressItem(item)}>
            {item.custom_image ? <FastImage
                source={{ uri: item.custom_image }}
                style={styles.img}
            /> :
                <FastImage
                    source={{ uri: 'https://native235.pwa-commerce.com/media/catalog/category//media/catalog/category/image_noti_1.png' }}
                    style={styles.img}
                />
            }
            <Text style={{ fontSize: 12 }}>{item.name}</Text>
        </TouchableOpacity>
    )

    if (props.parent.childCategory) {
        return (
            <View style={styles.container}>
                <FlatList
                    bounces={false}
                    data={props.parent.childCategory}
                    keyExtractor={item => item.entity_id}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    renderItem={renderItems}
                />
            </View>
        )
    } else return null
}

export default Categories