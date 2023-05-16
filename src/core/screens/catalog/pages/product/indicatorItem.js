import React from 'react'
import { TouchableOpacity, Image, Dimensions } from 'react-native'
import Identify from "../../../../helper/Identify";
import FastImage from 'react-native-fast-image'
export default class IndicatorItem extends React.Component {
    onSelectImage(index) {
        this.props.parent.setState({ index: index });
    }
    render() {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.onSelectImage(this.props.index)
                }}
                style={{ borderRadius: 2, marginLeft: 10 }}>
                <FastImage resizeMode={FastImage.resizeMode.contain} source={{ uri: this.props.item.url }}
                    style={{
                        borderWidth: 2,
                        borderColor: this.props.index === this.props.parentIndex ? Identify.theme.button_background : 'transparent',
                        aspectRatio: 1,
                        width: (Dimensions.get('window').width - 50) / 4,
                        borderRadius: 2,
                        overflow: 'hidden'
                    }} />
            </TouchableOpacity>
        )
    }
}