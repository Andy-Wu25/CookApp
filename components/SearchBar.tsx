import React from 'react';
import { View, TextInput, StyleSheet, Pressable, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onFocus?: () => void;
    autoFocus?: boolean;
    isDummy?: boolean;
    onPressDummy?: () => void;
    onClear?: () => void;

}

const SearchBar: React.FC<SearchBarProps> = ({
                                                 value,
                                                 onChangeText,
                                                 placeholder = 'Search...',
                                                 onFocus,
                                                 autoFocus = false,
                                                 isDummy = false,
                                                 onPressDummy,
                                                 onClear,
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
                {onClear && (
                    <TouchableOpacity onPress={onClear} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={20} color="#888" />
                    </TouchableOpacity>
                )}
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

            {onClear && (
                <TouchableOpacity onPress={onClear} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color="#888" />
                </TouchableOpacity>
            )}
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
        marginBottom: 8,
        paddingHorizontal: 12,
        height: 42,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    placeholderText: {
        color: '#888',
    },
    clearButton: {
        padding: 4,
        marginLeft: 8,
    },
});