import React from 'react';
import { FlatList, ScrollView, View, TouchableOpacity } from 'react-native';
import { ListItem, Left, Right, Icon, Text, H3 } from "native-base";
import Identify from '@helper/Identify';
import variable from '@theme/variables/material';
import NavigationManager from '@helper/NavigationManager';
import SimiPageComponent from '@base/components/SimiPageComponent';
import styles from './styles';

class Filter extends SimiPageComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            selected: this.props.navigation.getParam("filter").layer_filter && this.props.navigation.getParam("filter").layer_filter.length > 0 ? this.props.navigation.getParam("filter").layer_filter[0].attribute : null,
            filteredData: this.props.navigation.getParam("filter").layer_filter && this.props.navigation.getParam("filter").layer_filter.length > 0 ? this.props.navigation.getParam("filter").layer_filter[0].filter : null,
            data: null,
            selectedCbx: '',
            multiFilter: this.props.navigation.getParam("filter")?.layer_state ? this.props.navigation.getParam("filter")?.layer_state : []
        }
        this.isPage = true;
        this.selected = this.props.navigation.getParam("filter");
        this.onFilterAction = this.props.navigation.getParam("onFilterAction");
    }

    openSelection = (item) => {
        this.setState({
            selected: item.attribute,
            filteredData: item.filter
        })
    }

    onSelectFilter = (item) => {
        if (this.state.multiFilter.map((item) => item.attribute).includes(this.state.selected)) {
            let check = this.state.multiFilter.filter((multiItem) => multiItem.value == item.value);
            if (check.length > 0) {
                let filterArray = this.state.multiFilter.filter((multiItem) => multiItem.value !== item.value);
                this.setState({
                    // data: params,
                    selected: this.state.selected,
                    selectedCbx: item.value,
                    multiFilter: filterArray?.length > 0 ? filterArray.map((multiItem) => {
                        if (multiItem.attribute == this.state.selected) {
                            return {
                                attribute: this.state.selected,
                                value: item.value
                            }
                        } else {
                            return multiItem
                        }
                    }) : []
                });
            } else {
                this.setState({
                    // data: params,
                    selectedCbx: item.value,
                    multiFilter: this.state.multiFilter.map((multiItem) => {
                        if (multiItem.attribute == this.state.selected) {
                            return {
                                attribute: this.state.selected,
                                value: item.value
                            }
                        } else {
                            return multiItem
                        }
                    })
                });
            }

        } else {
            this.setState({
                // data: params,
                selectedCbx: item.value,
                multiFilter: [
                    ...this.state.multiFilter,
                    {
                        attribute: this.state.selected,
                        value: item.value
                    }
                ]
            });
        }

    }

    handleFilter = () => {
        if (this.state.multiFilter.length > 0) {
            let params = {};
            this.props.navigation.getParam("filter").layer_filter;
            let filter = this.state.multiFilter;
            for (let i = 0; i < filter.length; i++) {
                let item = filter[i];
                if (item.attribute != 'cat') {
                    params['filter[layer][' + item.attribute + ']='] = item.value;
                }
            }
            console.log("filter: ", filter);
            this.onFilterAction(params);
            NavigationManager.backToPage(this.props.navigation, 1);
        } else {
            // NavigationManager.backToPage(this.props.navigation, 1);
        }
    }

    onRemoveFilter = (remove) => {
        if (remove.attribute != 'cat') {
            let params = {};
            let selected = this.state.multiFilter;
            for (let i = 0; i < selected.length; i++) {
                let item = selected[i];
                if (item.attribute != 'cat' && item.attribute != remove.attribute) {
                    params['filter[layer][' + item.attribute + ']'] = item.value;
                }
            }

            this.onFilterAction(params);

            NavigationManager.backToPreviousPage(this.props.navigation);
        }
    }

    onClearFilter = () => {
        this.onFilterAction(null);
        NavigationManager.backToPreviousPage(this.props.navigation);
    }

    createSelectedListProps() {
        return {
            data: this.props.navigation.getParam("filter").layer_state,
            showsVerticalScrollIndicator: false
        };
    }

    renderItemSelected(item) {
        return (
            <ListItem onPress={() => { this.onRemoveFilter(item) }}>
                <Left>
                    <View style={styles.selectedContainer}>
                        <Text style={styles.itemText}>{Identify.__(item.title)}:</Text>
                        <Text style={styles.selectedText}>{Identify.__(item.label)}</Text>
                    </View>
                </Left>
                <Right>
                    <Icon name="md-close" />
                </Right>
            </ListItem>
        );
    }

    createSelectionListProps() {
        return {
            data: this.props.navigation.getParam("filter").layer_filter,
            showsVerticalScrollIndicator: false
        };
    }

    renderItemSelection = ({ item }) => {
        if (item.filter && item.filter.length) {
            return (
                <TouchableOpacity
                    style={[styles.item, { backgroundColor: this.state.selected === item.attribute ? '#FFF' : '#F2F2F2' }]}
                    onPress={() => {
                        // this.setState({ selectedCbx: item.filter[0].value });
                        this.openSelection(item);
                    }}
                >
                    <Text>{Identify.__(item.title)}</Text>
                </TouchableOpacity>
            );
        } else return null
    }

    checkValue(item) {
        if (this.state.multiFilter.map((multiItem) => multiItem.value).includes(item.value)) {
            return true;
        }
        return false;
    }

    renderItemFilter = ({ item }) => {
        let check = false;
        if (this.state.multiFilter.map((multiItem) => multiItem.value).includes(item.value)) {
            check = true;
        }

        return (
            <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
                onPress={() => this.onSelectFilter(item)}
            >
                <View style={styles.cbx}>
                    {check ? <Icon name={"md-checkmark"} style={{ fontSize: 12, color: 'black' }} /> : null}
                </View>
                <Text>{Identify.__(item.label)}</Text>
            </TouchableOpacity>
        );
    }

    //New
    renderLeft = () => {
        return (
            <FlatList
                data={this.props.navigation.getParam("filter").layer_filter}
                extraData={this.state.selected}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.attribute}
                renderItem={this.renderItemSelection}
            />
        )
    }

    renderRight = () => {
        return (
            <FlatList
                data={this.state.filteredData}
                extraData={this.state.multiFilter}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.value}
                renderItem={this.renderItemFilter}
            />
        )
    }

    renderPhoneLayout() {
        return (
            <>
                <ScrollView style={{ backgroundColor: variable.appBackground }}>
                    <View style={{ width: '100%', padding: 12, backgroundColor: '#F2F2F2' }}>
                        <Text style={{ color: '#000', fontSize: 20, fontWeight: 'bold' }}>{Identify.__('Filter')}</Text>
                    </View>
                    {this.selected.layer_state && this.selected.layer_state.length > 0 && <View>
                        <H3 style={styles.title}>{Identify.__('ACTIVATED')}</H3>
                        <FlatList
                            {...this.createSelectedListProps()}
                            keyExtractor={(item) => item.attribute}
                            renderItem={({ item }) => this.renderItemSelected(item)} />
                    </View>}
                    {this.selected.layer_filter && this.selected.layer_filter.length > 0 &&
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '33%' }}>
                                {this.renderLeft()}
                            </View>
                            <View style={{ width: '67%', paddingTop: 19, paddingHorizontal: 16 }}>
                                {this.renderRight()}
                            </View>
                        </View>}
                </ScrollView>
                <View style={styles.btnActions}>
                    <TouchableOpacity
                        onPress={this.onClearFilter}
                        style={[styles.btn, { backgroundColor: '#ECEEF5' }]}
                    >
                        <Text style={[styles.textBtn, { color: '#224299' }]}>{Identify.__('Reset')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: '#224299' }]}
                        onPress={this.handleFilter}
                    >
                        <Text style={[styles.textBtn, { color: '#FFF' }]}>{Identify.__('Apply')}</Text>
                    </TouchableOpacity>
                </View>
            </>
        );
    }
}

export default Filter;