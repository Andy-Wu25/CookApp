import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

type TagBarProps = {
    title: string;
    tags: string[];
    selected: string | string[] | null;
    onToggle: (tag: string) => void;
    color?: string;
    borderColor?: string;
};

export const TagBar = ({
                           title,
                           tags,
                           selected,
                           onToggle,
                           color = 'bg-gray-200',
                           borderColor = 'border-gray-400',
                       }: TagBarProps) => {
    const isSelected = (tag: string) => {
        if (Array.isArray(selected)) return selected.includes(tag);
        return selected === tag;
    };

    return (
        <View style={styles.row}>
            <Text style={styles.title}>{title}:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsContainer}>
                {tags.map((tag) => {
                    const selectedStyle = isSelected(tag)
                        ? [styles.tagSelected, { borderColor: '#4ADE80', backgroundColor: '#DCFCE7' }]
                        : [styles.tag];
                    return (
                        <TouchableOpacity key={tag} onPress={() => onToggle(tag)} style={selectedStyle}>
                            <Text style={isSelected(tag) ? styles.tagTextSelected : styles.tagText}>{tag}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        paddingHorizontal: 16,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 8,
        minWidth: 75,
    },
    tagsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    tag: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        backgroundColor: '#F3F4F6',
    },
    tagSelected: {
        borderWidth: 1,
        borderColor: '#4ADE80',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        backgroundColor: '#DCFCE7',
    },
    tagText: {
        fontSize: 14,
        color: '#374151',
    },
    tagTextSelected: {
        fontSize: 14,
        color: '#065F46',
        fontWeight: 'bold',
    },
});