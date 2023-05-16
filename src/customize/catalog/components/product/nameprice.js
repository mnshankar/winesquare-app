import React from 'react';
import { View } from 'react-native'
import { Text } from 'native-base'
import SimiComponent from "@base/components/SimiComponent";
import styles from './styles';

export default class ProductNamePriceComponent extends SimiComponent {

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this)
        }
    }
    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined)
        }
    }

    renderWinePoint() {
        if (this.props.product?.additional && this.props.product?.additional?.wine_point) {
            return (
                <View style={{ backgroundColor: "red", borderRadius: 9999, width: 50, height: 50, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "white", textAlign: "center" }}>
                        {this.props.product?.additional?.wine_point?.value}
                    </Text>
                </View>
            )
        }
        return null;
    }

    renderPhoneLayout() {
        if (this.props.product == null) {
            return (null);
        }

        return (
            <View style={styles.card}>
                <Text style={styles.sku}>SKU#: {this.props.product.sku}</Text>
                <Text style={styles.name}>{this.props.product.name}</Text>
                {
                    this.props.product?.additional && this.props.product?.additional?.wine_point ? (
                        <View style={{ marginVertical: 5 }}>
                            {
                                this.renderWinePoint()
                            }
                        </View>
                    ) : null
                }
            </View>
        );
    }
}