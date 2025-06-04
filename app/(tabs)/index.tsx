import React, { useState } from 'react';
import { Text, FlatList, Image, TouchableOpacity, View, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { recipes } from '@/data/recipes';

const CUISINE_TAGS = ['Western', 'Asian', 'Chinese', 'Thai', 'Mexican', 'Korean', 'Middle Eastern', 'Indian', 'Japanese'];

export default function Index() {
    const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);

    const toggleCuisineFilter = (tag: string) => {
        setSelectedCuisine((prev) => (prev === tag ? null : tag));
    };

    const filteredRecipes = recipes.filter((recipe) => {
        if (!selectedCuisine) return true;
        return recipe.cuisine === selectedCuisine;
    });


    return (
        <View>
            {/* Section title */}
            <Text className="text-lg font-semibold px-4 pb-2 pt-10">Filter by Cuisine:</Text>

            {/* Cuisine Tag Bar (Single Select) */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="px-2 pb-2"
                contentContainerStyle={{ gap: 8 }}
            >
                {CUISINE_TAGS.map((tag) => {
                    const isSelected = selectedCuisine === tag;
                    return (
                        <TouchableOpacity
                            key={tag}
                            onPress={() => toggleCuisineFilter(tag)}
                            className={`h-10 px-4 flex-row items-center justify-center rounded-full border ${
                                isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                            }`}
                        >
                            <Text numberOfLines={1} className={`text-sm ${isSelected ? 'text-white' : 'text-black'}`}>
                                {tag}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Filtered Recipe List */}
            <FlatList
                data={filteredRecipes}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={
                    <Text className="text-center text-gray-500 mt-10">
                        No recipes match the selected cuisine.
                    </Text>
                }
                renderItem={({ item }) => (
                    <Link href={`/recipes/${item.id}`} asChild>
                        <TouchableOpacity className="mb-4 bg-white p-4 rounded-xl shadow">
                            <Image
                                source={item.image}
                                className="w-full h-40 rounded-lg"
                                resizeMode="cover"
                            />
                            <Text className="text-xl font-semibold mt-2">{item.name}</Text>
                            <Text className="text-sm text-gray-500">
                                {item.cuisine} • {item.category}
                            </Text>
                            <Text className="text-sm text-green-600">{item.difficulty}</Text>
                        </TouchableOpacity>
                    </Link>
                )}
            />
        </View>
    );
}
