import React from 'react';
import { View, TextInput, StyleSheet, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onFocus?: () => void;
    autoFocus?: boolean;
    isDummy?: boolean; // New prop
    onPressDummy?: () => void; // New prop
}

const SearchBar: React.FC<SearchBarProps> = ({
                                                 value,
                                                 onChangeText,
                                                 placeholder = 'Search...',
                                                 onFocus,
                                                 autoFocus = false,
                                                 isDummy = false,
                                                 onPressDummy,
                                             }) => {
    if (isDummy) {
        return (
            <Pressable onPress={onPressDummy} style={styles.container}>
                <Ionicons name="search" size={20} color="#888" style={styles.icon} />
                <Text
                    style={[
                        styles.input, // Use input style for consistent appearance
                        !value && styles.placeholderText, // Apply placeholder color if value is empty
                    ]}
                    numberOfLines={1}
                >
                    {value || placeholder}
                </Text>
            </Pressable>
        );
    }

    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color="#888" style={styles.icon} />
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#888"
                onFocus={onFocus}
                autoFocus={autoFocus}
                returnKeyType="search"
            />
        </View>
    );
};

export default SearchBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E5E7EB',
        borderRadius: 8,
        marginHorizontal: 16,
        marginTop: 12,
        paddingHorizontal: 12,
        height: 42,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333', // Color for actual text
    },
    placeholderText: { // Style for the placeholder text in dummy mode
        color: '#888', // Color for placeholder
    },
});