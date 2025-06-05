import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import React from "react";

export const TagBar = ({ title, tags, selected, onToggle, color, borderColor }: any) => (
    <View className="pt-3 pb-1 px-0">
        <Text className="text-lg font-semibold px-4 pb-2">{title}</Text>
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-2"
            contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
        >
            {tags.map((tag: string) => {
                const isSelected = Array.isArray(selected) ? selected.includes(tag) : selected === tag;
                return (
                    <TouchableOpacity
                        key={tag}
                        onPress={() => onToggle(tag)}
                        className={`h-10 px-4 flex-row items-center justify-center rounded-full border ${
                            isSelected
                                ? `${color} ${borderColor}`
                                : 'bg-white border-gray-300'
                        }`}
                    >
                        <Text numberOfLines={1} className={`text-sm ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                            {tag}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    </View>
);

export default TagBar