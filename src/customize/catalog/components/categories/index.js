import React from 'react';
import { FlatList, View } from 'react-native';
import CategoriesItem from './categoriesItem';

class Categories extends React.Component {

    constructor(props) {
        super(props);
    }

    createListProps() {
        return {
            style: { marginTop: this.props.topMargin },
            data: this.props.parent.categoryData.categories,
            showsVerticalScrollIndicator: false
        }
    }

    renderItem(item) {
        return (
            <CategoriesItem item={item} navigation={this.props.navigation} />
        );
    }

    render() {
        return (
            <View>
                <FlatList
                    {...this.createListProps()}
                    keyExtractor={(item) => item.entity_id}
                    renderItem={({ item }) => this.renderItem(item)} />
            </View>
        );
    }
}
export default Categories;
