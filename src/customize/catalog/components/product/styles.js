import { StyleSheet } from "react-native";
import material from '../../../../../native-base-theme/variables/material';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bannerCard: {
        flex: 1,
        marginTop: 10,
        marginBottom: 0,
        marginLeft: 10,
        marginRight: 0,
        overflow: 'hidden',
        position: 'relative'
    },
    bannerImage: {
        flex: 1
    },
    outOfStock: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'red',
        color: 'white',
        padding: 5,
    },
    card: {
        flex: 1,
        marginTop: 12,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 16
    },
    cardContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        flex: 1,
        textAlign: 'left'
    },
    extendIcon: {
        fontSize: 20,
        color: '#c9c9c9'
    },
    contentDescription: {
        fontSize: material.textSizeSmall,
        flex: 1,
        textAlign: 'left'
    },
    sku: {
        textAlign: 'left',
        color: '#828282',
        marginBottom: 8
    },
    name: {
        textAlign: 'left',
        fontSize: 16,
    },
    price: {
        fontSize: 1,
    },
    addToCart: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 50,
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10
    },
    scroll: {
        paddingBottom: 60
    },
    imageActions: {
        position: 'absolute',
        zIndex: 99,
        right: 16,
        top: 16
    },
    action: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3
    },
    addToCart: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 20
    },
    textBtn: {
        fontSize: 15,
    },
    icon: {
        width: 22,
        height: 22
    },
    btn: {
        paddingHorizontal: 8,
        height: 40,
        borderRadius: 2,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    iconImg: {
        width: 24,
        height: 24
    }
})
