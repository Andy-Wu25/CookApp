import React, { useState, useEffect } from 'react';
import { Text, FlatList, Image, TouchableOpacity, View, ScrollView, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Recipe, CUISINE_TAGS_UI, CATEGORY_TAGS_UI, FLAVOUR_TAGS_UI } from '@/lib/recipe';

// --- getTagText helper (UPDATED for flags) ---
const getTagText = (tagWithPossibleEmoji: string): string => {
    if (!tagWithPossibleEmoji) return '';
    // Regex to remove common emoji ranges, regional indicators (flags), AND common variation selectors
    return tagWithPossibleEmoji.replace(/[\u{1F300}-\u{1FAD6}\u{1F600}-\u{1F64F}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\uFE0F\uFE0E]/gu, '').trim();
};

export default function Index() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedFlavours, setSelectedFlavours] = useState<string[]>([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('recipes').select('*');
            if (error) {
                console.error('Fetch error:', error);
            } else {
                setRecipes(data || []);
            }
            setLoading(false);
        };
        fetchRecipes();
    }, []);

    const filteredRecipes = recipes.filter((recipe) => {
        // --- CUISINE ---
        const matchesCuisine = selectedCuisine
            ? getTagText(selectedCuisine || '').toLowerCase() === (recipe.cuisine || '').toLowerCase()
            : true;

        // --- CATEGORY ---
        const recipeCategoriesFromDB = (Array.isArray(recipe.category)
                ? recipe.category.map(c => String(c || '').trim().toLowerCase())
                : (recipe.category ? [String(recipe.category || '').trim().toLowerCase()] : [])
        ).filter(Boolean);

        const matchesCategories = selectedCategories.length > 0
            ? selectedCategories.every(uiTagWithEmoji => {
                const plainUiTagLowercase = getTagText(uiTagWithEmoji || '').toLowerCase();
                return recipeCategoriesFromDB.includes(plainUiTagLowercase);
            })
            : true;

        // --- FLAVOUR ---
        const recipeFlavoursFromDB = (Array.isArray(recipe.flavour)
                ? recipe.flavour.map(f => String(f || '').trim().toLowerCase())
                : (recipe.flavour ? [String(recipe.flavour || '').trim().toLowerCase()] : [])
        ).filter(Boolean);

        const matchesFlavours = selectedFlavours.length > 0
            ? selectedFlavours.every(uiTagWithEmoji => {
                const plainUiTagLowercase = getTagText(uiTagWithEmoji || '').toLowerCase();
                return recipeFlavoursFromDB.includes(plainUiTagLowercase);
            })
            : true;

        return matchesCuisine && matchesCategories && matchesFlavours;
    });

    const TagBar = ({ title, tags, selected, onToggle, color, borderColor }: any) => (
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

    if (loading) {
        return <View style={styles.centered}><Text className="text-center">Loading recipes...</Text></View>;
    }

    return (
        <View style={styles.container}>
            <TagBar
                title="Filter by Cuisine"
                tags={CUISINE_TAGS_UI} // Will now display with emojis/flags
                selected={selectedCuisine}
                onToggle={(tag: string) => setSelectedCuisine(prev => (prev === tag ? null : tag))}
                color="bg-blue-500"
                borderColor="border-blue-500"
            />
            <TagBar
                title="Filter by Category"
                tags={CATEGORY_TAGS_UI}
                selected={selectedCategories}
                onToggle={(tag: string) => setSelectedCategories(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                color="bg-green-500"
                borderColor="border-green-500"
            />
            <TagBar
                title="Filter by Flavour"
                tags={FLAVOUR_TAGS_UI}
                selected={selectedFlavours}
                onToggle={(tag: string) => setSelectedFlavours(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                color="bg-yellow-500"
                borderColor="border-yellow-500"
            />

            <FlatList
                data={filteredRecipes}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, paddingTop: 12 }}
                ListEmptyComponent={
                    <View style={styles.emptyListContainer}>
                        <Text className="text-center text-gray-500">No recipes match the selected filters.</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <Link href={`/recipes/${item.id}`} asChild>
                        <TouchableOpacity className="mb-4 bg-white p-4 rounded-xl shadow">
                            <Image source={{ uri: item.image_url || undefined }} className="w-full h-40 rounded-lg" resizeMode="cover" />
                            <Text className="text-xl font-semibold mt-2">{item.name || 'Unnamed Recipe'}</Text>
                            <Text className="text-sm text-gray-500">
                                {item.cuisine || 'N/A Cuisine'} • {
                                Array.isArray(item.category)
                                    ? (item.category.filter(Boolean).join(', ') || 'N/A Category')
                                    : (item.category || 'N/A Category')
                            }
                            </Text>
                            <Text className="text-sm text-green-600">{item.difficulty || 'N/A Difficulty'}</Text>
                        </TouchableOpacity>
                    </Link>
                )}
                style={styles.flatList}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        paddingTop: 20,
    },
    flatList: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyListContainer: {
        paddingTop: 50,
        alignItems: 'center',
    },

});