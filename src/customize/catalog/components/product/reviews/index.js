import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'native-base'
import Identify from '@helper/Identify';
import styles from './styles';
import StarRating from 'react-native-star-rating';
import NavigationManager from '@helper/NavigationManager';

const ProductReviewsComponent = (props) => {

    let starCount = props.product.app_reviews ? props.product.app_reviews.rate : 0
    if (Identify.isEmpty(props.customer_data)) {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => {
                    NavigationManager.openPage(props.navigation, 'AddReview', {
                        productId: props.product.entity_id,
                        rateForm: props.product.app_reviews.form_add_reviews[0]
                    });
                }}>
                    <Text style={styles.text}>{Identify.__('Add Your Review')}</Text>
                </TouchableOpacity>
                {props.product.app_reviews.rate != null && <Text style={styles.rate}>({props.product.app_reviews.rate.toFixed(1)})</Text>}
                <StarRating
                    maxStars={5}
                    rating={starCount}
                    starSize={17}
                    containerStyle={{ marginStart: 12 }}
                    fullStarColor='#828282'
                    emptyStarColor='#828282'
                />
            </View>
        );
    } else {
        return (null);
    }
}

export default ProductReviewsComponent