import React from 'react'
import { View } from 'react-native'
import { Text } from 'native-base'
import Identify from '../../../../core/helper/Identify'

export default class Plan extends React.Component {
    render() {
        return (
            <View style={{ flexDirection: 'row', margin: 15, alignItems:'center' }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{
                        height: 15, width: 15, borderRadius: 15, backgroundColor: '#224299',
                        justifyContent: 'center', alignItems: 'center', marginTop: 1
                    }}>
                        <Text style={{ color: 'white', fontSize: 10 }}>1</Text>
                    </View>
                    <Text style={{ marginLeft: 3, fontSize: 12, color: '#4F4F4F' }}>{Identify.__('Bag')}</Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor:'#BDBDBD', marginLeft: 3, marginRight: 3}}/>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{
                        height: 15, width: 15, borderRadius: 15, backgroundColor: this.props.isOrder ? '#224299' : '#ECEEF5',
                        justifyContent: 'center', alignItems: 'center', marginTop: 1
                    }}>
                        <Text style={{ color: 'white', fontSize: 10, color: this.props.isOrder ? 'white' : '#224299' }}>2</Text>
                    </View>
                    <Text style={{ marginLeft: 3, fontSize: 12, color: this.props.isOrder ? '#4F4F4F' : '#BDBDBD' }}>{Identify.__('Address')}</Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor:'#BDBDBD', marginLeft: 3, marginRight: 3}}/>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{
                        height: 15, width: 15, borderRadius: 15, backgroundColor: this.props.isOrder && this.props.parent.isPayment ? '#224299' : '#ECEEF5',
                        justifyContent: 'center', alignItems: 'center', marginTop: 1
                    }}>
                        <Text style={{ color: 'white', fontSize: 10, color: this.props.isOrder && this.props.parent.isPayment ? 'white' : '#224299' }}>3</Text>
                    </View>
                    <Text style={{ marginLeft: 3, fontSize: 12, color: this.props.isOrder && this.props.parent.isPayment ? '#4F4F4F' : '#BDBDBD' }}>{Identify.__('Payment')}</Text>
                </View>
            </View>
        )
    }
}