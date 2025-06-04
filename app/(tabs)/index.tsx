import React, { useState, useEffect } from 'react';
import { Text, FlatList, Image, TouchableOpacity, View, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Recipe } from '@/lib/recipe';

const CUISINE_TAGS = ['Western', 'Asian', 'Chinese', 'Thai', 'Mexican', 'Korean', 'Middle Eastern', 'Indian', 'Japanese'];
const CATEGORY_TAGS = ['Meat🥩', 'Vegetarian🥬', 'Seafood🐟', 'Dessert🍰', 'Vegan🌱'];
const FLAVOUR_TAGS = ['Spicy🌶️', 'Sweet🍭', 'Sour🍋', 'Savoury🍽️'];

export default function Index() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedFlavours, setSelectedFlavours] = useState<string[]>([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            const { data, error } = await supabase.from('recipes').select('*');
            if (error) {
                console.error('Fetch error:', error);
            }
            else {
                console.log('Fetched recipes:', data);
                setRecipes(data || []);
            }
            setLoading(false);
        };
        fetchRecipes();
    }, []);

    const filteredRecipes = recipes.filter((recipe) => {
        const matchesCuisine = selectedCuisine ? recipe.cuisine === selectedCuisine : true;
        const matchesCategories = selectedCategories.every(tag => recipe.category?.includes(tag));
        const matchesFlavours = selectedFlavours.every(tag => recipe.flavour?.includes(tag));
        return matchesCuisine && matchesCategories && matchesFlavours;
    });

    const TagBar = ({ title, tags, selected, onToggle, color }: any) => (
        <>
            <Text className="text-lg font-semibold px-4 pb-2 pt-4">{title}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-2 pb-5" contentContainerStyle={{ gap: 8 }}>
                {tags.map((tag: string) => {
                    const isSelected = Array.isArray(selected) ? selected.includes(tag) : selected === tag;
                    return (
                        <TouchableOpacity
                            key={tag}
                            onPress={() => onToggle(tag)}
                            className={`h-10 px-4 flex-row items-center justify-center rounded-full border ${
                                isSelected ? `${color} border-${color}` : 'border-gray-300'
                            }`}
                        >
                            <Text numberOfLines={1} className={`text-sm ${isSelected ? 'text-white' : 'text-black'}`}>
                                {tag}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </>
    );

    if (loading) return <Text className="text-center mt-10">Loading recipes...</Text>;

    return (
        <View>
            <TagBar title="Filter by Cuisine" tags={CUISINE_TAGS} selected={selectedCuisine} onToggle={(tag: string) =>
                setSelectedCuisine(prev => (prev === tag ? null : tag))
            } color="bg-blue-500" />

            <TagBar title="Filter by Category" tags={CATEGORY_TAGS} selected={selectedCategories} onToggle={(tag: string) =>
                setSelectedCategories(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
            } color="bg-green-500" />

            <TagBar title="Filter by Flavour" tags={FLAVOUR_TAGS} selected={selectedFlavours} onToggle={(tag: string) =>
                setSelectedFlavours(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
            } color="bg-yellow-500" />

            <FlatList
                data={filteredRecipes}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={<Text className="text-center text-gray-500 mt-10">No recipes match the selected filters.</Text>}
                renderItem={({ item }) => (
                    <Link href={`/recipes/${item.id}`} asChild>
                        <TouchableOpacity className="mb-4 bg-white p-4 rounded-xl shadow">
                            <Image source={{ uri: item.image_url }} className="w-full h-40 rounded-lg" resizeMode="cover" />
                            <Text className="text-xl font-semibold mt-2">{item.name}</Text>
                            <Text className="text-sm text-gray-500">{item.cuisine} • {item.category?.join(', ')}</Text>
                            <Text className="text-sm text-green-600">{item.difficulty}</Text>
                        </TouchableOpacity>
                    </Link>
                )}
            />
        </View>
    );
}
