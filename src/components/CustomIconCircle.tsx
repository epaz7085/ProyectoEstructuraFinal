import React from 'react';
import { View, StyleSheet } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

type Props = {
    iconName: string;
    iconSize?: number;
    iconColor?: string;
};

export default function CustomIconCircle({ iconName, iconSize = 30, iconColor = "#1b4332" }: Props) {
    return (
        <View style={styles.iconCircle}>
            <FontAwesome5 name={iconName as any} size={iconSize} color={iconColor} />
        </View>
    );
}

const styles = StyleSheet.create({
    iconCircle: {
        backgroundColor: 'white',
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 16,
    },
});