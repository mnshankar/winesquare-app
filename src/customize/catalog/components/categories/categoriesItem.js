import React, {useState} from 'react';
import { Text, TouchableOpacity, } from 'react-native'
import { Icon } from "native-base";
import NavigationManager from '@helper/NavigationManager';
import Identify from '@helper/Identify';
import styles from './styles'
import { scale, verticalScale } from 'react-native-size-matters';

const CategoriesItem = (props) => {
    const [disableButton, setDisableButton] = useState(false)
    function onPress() {
        setDisableButton(true)
        setTimeout(() => {
            setDisableButton(false)
        }, 200)
    }

    function openCategory(category) {
        if (category.has_children) {
            routeName = 'Category',
                params = {
                    categoryId: category.entity_id,
                    hasChild: category.has_children,
                    categoryName: category.name,
                };
        } else {
            routeName = 'Products',
                params = {
                    categoryId: category.entity_id,
                    categoryName: category.name,
                };
        }
        NavigationManager.openPage(props.navigation, routeName, params);
        // comment
    };

    let item = props.item;
    return (
        <TouchableOpacity 
            disabled={disableButton}
            onPress={() => { openCategory(item); onPress() }} 
            style={styles.item}>    
            <Text style={styles.itemName}>{item.name}</Text>
            <Icon name={Identify.isRtl() ? 'ios-arrow-back' : "ios-arrow-forward"} style={{ color: 'black', fontSize: 24 }} />
        </TouchableOpacity>
    )

}
export default CategoriesItem;