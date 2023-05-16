import { StyleSheet } from "react-native";
import { scale, verticalScale } from 'react-native-size-matters';
import Device from '@helper/device';

export default StyleSheet.create({
    verticalList: {
        marginLeft: 5,
        marginRight: 5
    },
    subAction: {
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    subActionIcon: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'flex-end'
    },
    image: {
        flex: 1,
        aspectRatio: 1,
        overflow: 'hidden',
        position: 'relative'
    },
    imageList: {
        width: Device.isTablet() ? 250 : 170,
        aspectRatio: 1,
        overflow: 'hidden',
        margin: 4,
        borderRadius: 5
    },
    outOfStock: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'red',
        color: 'white',
        padding: 5,
    },
    name: {
        lineHeight: 16,
    },
    bottom: {
        backgroundColor: '#FFF',
        width: '100%',
        height: verticalScale(44),
        paddingVertical: verticalScale(10),
        flexDirection: 'row',
        justifyContent: 'center'
    },
    action: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    icon: {
        width: scale(16),
        height: verticalScale(16),
        tintColor: '#000000',
        marginRight: 2
    },
    txtAction: {
        fontSize: 12,
        // color: '#828282',
        color: 'black',
    },
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F2F2F2'
    },
    itemCate: {
        marginRight: 16,
        alignItems: 'center'
    },
    img: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 4,
        borderColor: '#FFF',
        marginBottom: 8
    },
    iconWishlist: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: '#FFF',
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3
    },
    iconWishlistList: {
        position: 'absolute',
        top: 20,
        right: 15,
        backgroundColor: '#FFF',
        width: 30,
        height: 30,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3
    },
})
