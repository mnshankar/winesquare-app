import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 10,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    reviewContainer: {
        borderWidth: 0.5,
        borderColor: '#828282',
        padding: 8
    },
    extendIcon: {
        fontSize: 20,
        color: '#c9c9c9'
    },
    text: {
        color: '#224299',
        textDecorationLine: 'underline', 
    },
    rate: {
        flexGrow: 1,
        textAlign: 'right',
        color: '#4F4F4F'
    }
})