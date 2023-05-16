import React from 'react';
import Identify from '@helper/Identify';
import { Button, Text } from "native-base";
import { StyleSheet } from 'react-native';
import NavigationManager from '@helper/NavigationManager';
import material from '../../../../../native-base-theme/variables/material';

const ThankButton = (props) => {

    return (
        <Button full style={styles.button} onPress={() => {
            NavigationManager.backToRootPage(props.navigation);
        }}>
            <Text style={{fontFamily: material.fontBold}}>{Identify.__('Continue Shopping')}</Text>
        </Button>
    );
}

const styles = StyleSheet.create({
    button: {
        marginTop: 30
    },
});

export default ThankButton;
