import { StyleSheet, Dimensions } from "react-native"

const { width } = Dimensions.get('window')

export default StyleSheet.create({
    itemText: {
        marginRight: 10
    },
    title: {
        marginLeft: 15,
        marginTop: 15
    },
    selectedContainer: {
        flexDirection: 'row'
    },
    selectedText: {
        marginLeft: 10
    },
    iconChecked: {
        color: 'gold'
    },
    item: {
        // width: '40%',
        paddingVertical: 18,
        paddingLeft: 16,
        marginBottom: 2
    },
    btnActions: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 40,
        justifyContent: 'space-between'
    },
    btn: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        width: (width - 48) / 2
    },
    textBtn: {
        fontSize: 15,
    },
    cbx: {
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#E0E0E0',
        marginRight: 8
    }
})
