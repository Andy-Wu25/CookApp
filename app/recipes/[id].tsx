import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { icons } from '@/constants/icons';
import { Recipe } from '@/lib/recipe';

export default function RecipeDetail() {
    const { id } = useLocalSearchParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            const { data, error } = await supabase
                .from('recipes')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching recipe:', error);
            } else {
                setRecipe(data);
            }
        };

        if (id) fetchRecipe();
    }, [id]);

    if (!recipe) {
        return <Text className="text-center mt-10">Loading recipe...</Text>;
    }

    return (
        <View className="bg-white flex-1">
            <ScrollView className="p-4">
                <Image source={{ uri: recipe.image_url }} className="w-full h-60 rounded-lg mb-4" resizeMode="cover" />
                <Text className="text-2xl font-bold mb-2">{recipe.name}</Text>
                <Text className="text-gray-500 mb-4">{recipe.cuisine} • {recipe.category?.join(', ')}</Text>

                <Text className="text-xl font-semibold mb-1">Ingredients:</Text>
                {recipe.ingredients?.map((ingredient, index) => (
                    <Text key={index}>• {ingredient}</Text>
                ))}

                <Text className="text-xl font-semibold mt-4 mb-1">Steps:</Text>
                {recipe.steps?.map((step, index) => (
                    <Text key={index}>{index + 1}. {step}</Text>
                ))}
            </ScrollView>

            <TouchableOpacity
                className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
                onPress={router.back}
            >
                <Image source={icons.arrow} className="size-5 mr-1 mt-0.5 rotate-180" tintColor="#fff" />
                <Text className="text-white font-semibold text-base">Go back</Text>
            </TouchableOpacity>
        </View>
    );
}
