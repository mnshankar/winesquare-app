import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon, Input } from 'native-base';
import Identify from '@helper/Identify';
import styles from './styles';

class Quantity extends React.Component {

    constructor(props) {
        super(props);
        this.checkoutQty = '1';
        this.state = {
            qty: '1'
        }
        this.test = "1";
    }

    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    getCheckoutQty() {
        return this.state.qty;
    }

    render() {
        return (
            <View style={styles.flex}>
                {/* <Text style={styles.text}>{Identify.__('Qty')}</Text> */}
                <TouchableOpacity
                    onPress={() => {
                        if (parseInt(this.state.qty) > 1) {
                            this.setState({
                                qty: (parseInt(this.state.qty) - 1).toString()
                            })
                        }
                    }}
                >

                    <View style={{ height: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon type='AntDesign' name="minuscircleo" style={{ fontSize: 20 }} />
                    </View>
                </TouchableOpacity>
                <View style={{ paddingHorizontal: 3 }}>
                    <Input
                        style={styles.input}
                        keyboardType="numeric"
                        returnKeyType="done"
                        onChangeText={(txt) => {
                            this.setState({
                                qty: txt
                            })
                            this.test = txt;
                        }}
                        onEndEditing={() => {
                            console.log("this.test: ", this.test);
                            if (!this.test) {
                                this.setState({
                                    qty: "1"
                                })
                            } else {
                                this.setState({
                                    qty: this.test
                                })
                            }
                        }}
                        value={this.state.qty}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            qty: (parseInt(this.state.qty) + 1).toString()
                        })
                    }}
                >
                    <View style={{ height: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon type='AntDesign' name="pluscircleo" style={{ fontSize: 20 }} />
                    </View>
                </TouchableOpacity>

            </View>
        );
    }

}

export default Quantity;
