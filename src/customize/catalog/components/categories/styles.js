import { StyleSheet } from "react-native";
import { scale, verticalScale } from 'react-native-size-matters';

export default StyleSheet.create({
    cateName: {
        width: '100%',
        textAlign: 'left',
        fontSize: 22,
        color: 'black'
    },
    cateNameWithViewAll: {
        // width: '70%',
        // flex: 7,
        textAlign: 'left',
        fontSize: 22
    },
    viewAll: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        // width: '30%', 
        // flex: 3,
        alignItems: 'center',
    },
    viewAllText: {
        fontSize: 18,
        color: 'black'
    },
    top: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: verticalScale(10),
        marginRight: scale(15),
        marginBottom: verticalScale(10),
        marginLeft: scale(15),
        flexWrap: 'wrap'
    },
    viewAllIcon: {
        marginTop: 2,
        fontSize: 24,
        // marginRight: 7,
        paddingHorizontal: 10,
        color: 'black'
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black'
    },
    item: {
        alignItems: 'center', 
        backgroundColor: 'white', 
        flexDirection: 'row', 
        paddingVertical: 10, 
        justifyContent: 'space-between', 
        paddingHorizontal: 10, 
        marginVertical: 1, 
        marginHorizontal: scale(15) 
    }
})
