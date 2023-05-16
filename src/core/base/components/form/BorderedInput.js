import React from 'react';
import BaseInput from './BaseInput';
import { Item, Icon, Input, Text, View } from 'native-base';
import { TouchableOpacity } from 'react-native'
import NavigationManager from "../../../helper/NavigationManager";
import Identify from '@helper/Identify';

export default class BorderedInput extends BaseInput {

    constructor(props) {
        super(props);
        this.state = {
            ...props.state,
            showPassword: this.props.inputKey === 'password' ? true : false
        }
    }

    initData() {
        super.initData();
        this.iconName = this.props.iconName;
    }

    addWarningIcon = () => {
        if (this.state.success === true) {
            return (<Icon name={'ios-checkmark-circle'} />)
        } else if (this.state.error === true) {
            return (<Icon name={'ios-close-circle'} />)
        }
        return null;
    }

    onInputValueChange(text) {
        this.state.value = text;
        let validateResult = this.validateInputValue(text);
        this.parent.updateFormData(this.inputKey, text, validateResult);
        if (this.props.required === true) {
            if (validateResult === true) {
                this.setState({ success: true, error: false });
            } else {
                this.setState({ success: false, error: true });
            }
        }
    }

    renderExtraIcon() {
        return this.props.extraIcon
    }

    createInputLayout() {
        return (
            <Item regular error={this.state.error} success={this.state.success} disabled={this.disabled} style={{ marginTop: 20, borderRadius: 4 }}>
                {this.iconName && <Icon active name={this.iconName} style={{ fontSize: 24 }} />}
                <Input
                    ref={(input) => { this.props.parent.listRefs[this.inputKey] = input }}
                    onSubmitEditing={() => { this.submitEditing() }}
                    returnKeyType={"done"}
                    placeholder={this.inputTitle}
                    keyboardType={this.keyboardType}
                    autoCapitalize='none'
                    clearButtonMode="while-editing"
                    secureTextEntry={this.state.showPassword}
                    onChangeText={(text) => {
                        this.onInputValueChange(text);
                    }}
                    defaultValue={this.props.inputValue}
                    style={{ textAlign: Identify.isRtl() ? 'right' : 'left' }}
                />
                {this.props.hasOwnProperty('extraIcon') && this.renderExtraIcon()}

                {
                    this.inputKey === 'password' ? (this.state.showPassword ? (
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    showPassword: false
                                })
                            }}
                        >
                            <View style={{ marginHorizontal: 3, paddingHorizontal: 5 }}>
                                <Icon name='eye' type='Entypo' style={{ fontSize: 22 }} />
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    showPassword: true
                                })
                            }}
                        >
                            <View style={{ marginHorizontal: 3, paddingHorizontal: 5 }}>
                                <Icon name='eye-with-line' type='Entypo' style={{ fontSize: 22 }} />
                            </View>
                        </TouchableOpacity>
                    )) : null
                }
                {this.props.needWarning && this.addWarningIcon()}
            </Item>
        );
    }

}