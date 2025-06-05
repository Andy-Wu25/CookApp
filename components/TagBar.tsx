import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type TagState = 'include' | 'exclude' | null;

interface TagBarProps {
    title: string;
    tags: string[];
    selected: Record<string, TagState>;
    onToggle: (tag: string) => void;
}

export const TagBar: React.FC<TagBarProps> = ({ title, tags, selected, onToggle }) => {
    return (
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
            <Text className="text-base font-semibold mb-2">{title}</Text>
            <View className="flex-row flex-wrap gap-2">
                {tags.map((tag) => {
                    const state = selected[tag];
                    let bgColor = 'bg-gray-200';
                    let textColor = 'text-gray-700';
                    if (state === 'include') {
                        bgColor = 'bg-green-500';
                        textColor = 'text-white';
                    } else if (state === 'exclude') {
                        bgColor = 'bg-red-500';
                        textColor = 'text-white';
                    }

                    return (
                        <TouchableOpacity
                            key={tag}
                            onPress={() => onToggle(tag)}
                            className={`px-3 py-1 rounded-full ${bgColor}`}
                        >
                            <Text className={`text-sm font-medium ${textColor}`}>{tag}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};


