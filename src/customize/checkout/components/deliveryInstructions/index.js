import ReactNative, { View, Text, TextInput, Keyboard, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import Identify from '@helper/Identify';
import material from '@theme/variables/material';
import SimiComponent from '@base/components/SimiComponent';
import NewConnection from "@base/network/NewConnection";
import { quoteitems } from '@helper/constants';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
class DeliveryInstructions extends SimiComponent {
    constructor(props) {
        super(props);
        this.state = {
            information: props.delivery_instructions,
        }
        this.check = true;
    }
    componentDidMount() {

    }

    _scrollToInput(reactNode) {
        // Add a 'scroll' ref to your ScrollView
        this.scroll.props.scrollToFocusedInput(reactNode)
    }
    // handleSubmit() {
    //     this.props.storeData('showLoading', { type: 'dialog' });
    //     let json = {};
    //     json[item_id] = qty;
    //     let data = {};
    //     data['event'] = 'cart_action';
    //     data['action'] = 'update_cart';
    //     data['item_id'] = item_id;
    //     data['qty'] = qty;
    //     Events.dispatchEventAction(data, this);

    //     new NewConnection()
    //         .init(quoteitems, 'update_item', this, 'PUT')
    //         .addBodyData(json)
    //         .connect();
    // }

    renderPhoneLayout() {
        return (
            <KeyboardAwareScrollView
                innerRef={ref => {
                    this.scroll = ref
                }}
                enableOnAndroid={true}
            >
                <View
                    style={{
                        marginLeft: 15,
                        marginRight: 15,
                        marginTop: 25,
                        marginBottom: 10
                    }}
                >
                    <View style={{ marginBottom: 5 }}>
                        <View style={{}}>
                            <Text style={{ fontFamily: material.fontBold, paddingVertical: 10, borderBottomWidth: 1 }}>
                                {Identify.__('ADDTIONAL INFORMATION').toUpperCase()}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
                                <Text>
                                    {Identify.__('Please add delivery instructions')}
                                </Text>
                                {
                                    this.props.parent.from !== 'cart' ? <Text style={{ color: "red" }}>
                                        *
                                    </Text> : null
                                }

                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.parent.hanleDeliveryInstructions(this.state.information);
                                }}
                            >
                                <View style={{ padding: 5, paddingHorizontal: 10, backgroundColor: Identify.theme.button_background, borderRadius: 3 }}>
                                    <Text style={{ color: "white", fontFamily: material.fontBold }}>
                                        {Identify.__('Submit')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}> */}

                    <TextInput
                        onFocus={(event) => {
                            // `bind` the function if you're using ES6 classes
                            this._scrollToInput(ReactNative.findNodeHandle(event.target))
                        }}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={(text) => {
                            this.setState({
                                information: text
                            })
                        }}
                        value={this.state.information}
                        style={{ borderWidth: 1, minHeight: 100, padding: 10, borderColor: "#e0e0e0" }}
                        returnKeyType='done'
                        onSubmitEditing={() => {
                            Keyboard.dismiss();
                        }}
                        focusable
                    />

                    {/* </KeyboardAvoidingView> */}
                </View>
            </KeyboardAwareScrollView>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        delivery_instructions: state.redux_data.delivery_instructions,
    };
}
//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryInstructions);