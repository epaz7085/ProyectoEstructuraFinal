import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
    title: string;
    subtitle?: string;
};

export default function CustomTitle({ title, subtitle }: Props) {
    return (
        <View>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 6,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 20,
        textAlign: 'center',
        color: '#b2b2b2',
    },
});