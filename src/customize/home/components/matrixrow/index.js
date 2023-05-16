import React from 'react';
import { FlatList, View, Text, TextInput, Keyboard } from 'react-native';
import { Button, Toast } from 'native-base';
import { connect } from 'react-redux';
import Row from './row';
import md5 from 'md5';
import Identify from '@helper/Identify';
import NewConnection from '../../../../core/base/network/NewConnection';
import { subscribe } from '../../../../core/helper/constants';
import material from '../../../../../native-base-theme/variables/material';

class MatrixRow extends React.Component {
    constructor(props) {
        super(props);
        this.matrixListRows = [];
        this.matrixItems = [];
        this.home_data = this.props.data;
        this.generateMatrixListItems();
        this.state = {
            email: '',
        }
    }

    generateMatrixListItems = () => {
        this.matrixListRows = [];
        let matrixMap = {};
        let homeCategories = this.home_data.home.homecategories.homecategories;
        for (let index in homeCategories) {
            let homeCate = homeCategories[index];
            if (!matrixMap[homeCate.matrix_row]) {
                matrixMap[homeCate.matrix_row] = [];
            }
            matrixMap[homeCate.matrix_row].push(homeCate);
        }
        let homeProductList = this.home_data.home.homeproductlists.homeproductlists;
        for (let index in homeProductList) {
            let homeProducts = homeProductList[index];
            if (!matrixMap[homeProducts.matrix_row]) {
                matrixMap[homeProducts.matrix_row] = [];
            }
            matrixMap[homeProducts.matrix_row].push(homeProducts);
        }

        for (let key in matrixMap) {
            this.matrixListRows.splice(key, 0, matrixMap[key]);
        }
    }
    validateEmail = (email) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) === false)
            return false;
        else
            return true;
    }
    suscribe = () => {
        Keyboard.dismiss()
        let param = {
            email: this.state.email
        }
        this.props.storeData('showLoading', { type: 'dialog' });
        new NewConnection()
            .init(subscribe, 'subscribe', this)
            .addGetData(param)
            .connect();
    }
    setData(data) {
        this.props.storeData('showLoading', { type: 'none' });
        if (!data.errors) {
            Toast.show({ text: Identify.__('Thanks for your Subscribe'), type: "success", duration: 3000, textStyle: { fontFamily: material.fontFamily } })
        }
    }
    renderMatrixItem = (item) => {
        return (<Row items={item} />);
    }
    render() {
        return (
            <View style={{ backgroundColor: '#eee' }}>
                <FlatList
                    data={this.matrixListRows}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => md5(index)}
                    renderItem={({ item }) =>
                        this.renderMatrixItem(item)
                    } />
                <View style={{ padding: 8 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{Identify.__('Subscribe to our newsletter')}</Text>
                    <View style={{ padding: 18, marginTop: 10, backgroundColor: '#fff', borderRadius: 4, borderWidth: 0.5, borderColor: '#ccc' }}>
                        <Text>{Identify.__('Find out about the latest releases, hard to find wines and great email-only deals:')}</Text>
                        <TextInput
                            style={{ height: 40, marginVertical: 20, borderWidth: 0.5, borderColor: '#ccc', borderRadius: 6, padding: 12 }}
                            onChangeText={(e) => {
                                this.setState({ email: e })
                            }}
                            value={this.state.email}
                            placeholder="Email Address"
                        />
                        <Button
                            disabled={!this.validateEmail(this.state.email)}
                            style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => { this.suscribe() }}
                        >
                            <Text style={{ color: Identify.theme.button_text_color, fontSize: 18 }}>{Identify.__('Subscribe')}</Text>
                        </Button>
                    </View>
                </View>
            </View>
        )

    }

}
const mapStateToProps = (state) => {
    return { data: state.redux_data.home_data };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(MatrixRow);
//export default MatrixRow;
