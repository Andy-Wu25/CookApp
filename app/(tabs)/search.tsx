import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router'; // Import useLocalSearchParams
import { supabase } from '@/lib/supabase';
import { Recipe, CUISINE_TAGS_UI, CATEGORY_TAGS_UI, FLAVOUR_TAGS_UI } from '@/lib/recipe';
import SearchBar from '@/components/SearchBar';
import { TagBar } from '@/components/TagBar';

const getTagText = (tagWithPossibleEmoji: string): string =>
    tagWithPossibleEmoji?.replace(/[\u{1F300}-\u{1FAD6}\u{1F600}-\u{1F64F}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\uFE0F\uFE0E]/gu, '').trim();

export default function SearchScreen() {
    const router = useRouter();
    const params = useLocalSearchParams(); // To potentially receive initial query/filters

    const [allRecipes, setAllRecipes] = useState<Recipe[]>([]); // Store all recipes fetched once
    const [loading, setLoading] = useState(true);

    // Filters and Query for this screen
    const [query, setQuery] = useState(typeof params.initialQuery === 'string' ? params.initialQuery : '');
    const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedFlavours, setSelectedFlavours] = useState<string[]>([]);

    // Fetch all recipes once when the screen mounts
    useEffect(() => {
        const fetchAllRecipes = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('recipes').select('*');
            if (error) console.error('Fetch error:', error);
            else setAllRecipes(data || []);
            setLoading(false);
        };
        fetchAllRecipes();
    }, []);

    const filteredRecipes = allRecipes.filter((recipe) => {
        const matchesQuery = query.trim() === ''
            || recipe.name?.toLowerCase().includes(query.toLowerCase())
            || recipe.ingredients?.some((i) => i.toLowerCase().includes(query.toLowerCase()));

        const matchesCuisine = selectedCuisine
            ? getTagText(selectedCuisine).toLowerCase() === (recipe.cuisine || '').toLowerCase()
            : true;

        const recipeCategories = Array.isArray(recipe.category) ? recipe.category : (recipe.category ? [recipe.category] : []);
        const matchesCategories = selectedCategories.length === 0 || selectedCategories.every(tag =>
            recipeCategories.map(c => getTagText(c || '').toLowerCase()).includes(getTagText(tag).toLowerCase())
        );

        const recipeFlavours = Array.isArray(recipe.flavour) ? recipe.flavour : (recipe.flavour ? [recipe.flavour] : []);
        const matchesFlavours = selectedFlavours.length === 0 || selectedFlavours.every(tag =>
            recipeFlavours.map(f => getTagText(f || '').toLowerCase()).includes(getTagText(tag).toLowerCase())
        );
        return matchesQuery && matchesCuisine && matchesCategories && matchesFlavours;
    });

    const resetFilters = () => {
        setSelectedCuisine(null);
        setSelectedCategories([]);
        setSelectedFlavours([]);
        // setQuery(''); // Optionally reset query too
    };

    const renderRecipeItem = ({ item }: { item: Recipe }) => (
        <TouchableOpacity
            className="mb-4 bg-white p-4 rounded-xl shadow mx-4"
            onPress={() =>
                router.push({
                    pathname: '/recipes/[id]',
                    params: { id: String(item.id), from: 'search' },
                })
            }
        >
            <Image source={{ uri: item.image_url || undefined }} className="w-full h-40 rounded-lg" resizeMode="cover" />
            <Text className="text-xl font-semibold mt-2">{item.name || 'Unnamed Recipe'}</Text>
            <Text className="text-sm text-gray-500">
                {`${item.cuisine || 'N/A'} • ${
                    Array.isArray(item.category) ? item.category.join(', ') : item.category || 'N/A'
                }`}
            </Text>
            <Text className="text-sm text-green-600">{item.difficulty || 'N/A Difficulty'}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.screenContainer}>
            <Stack.Screen options={{ title: 'Search & Filter', headerShown: true }} />
            <SearchBar
                value={query}
                onChangeText={setQuery}
                placeholder="Search recipes..."
                autoFocus // Good for a search screen
            />
            <FlatList
                data={filteredRecipes}
                keyExtractor={(item) => `search-recipe-${item.id}`}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                ListHeaderComponent={
                    <View style={{ paddingHorizontal: 0 }}>
                        <TagBar
                            title="Cuisine"
                            tags={CUISINE_TAGS_UI}
                            selected={selectedCuisine}
                            onToggle={(tag: string) => setSelectedCuisine(prev => prev === tag ? null : tag)}
                            color="bg-blue-500"
                            borderColor="border-blue-500"
                        />
                        <TagBar
                            title="Category"
                            tags={CATEGORY_TAGS_UI}
                            selected={selectedCategories}
                            onToggle={(tag: string) =>
                                setSelectedCategories(prev =>
                                    prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                                )}
                            color="bg-green-500"
                            borderColor="border-green-500"
                        />
                        <TagBar
                            title="Flavour"
                            tags={FLAVOUR_TAGS_UI}
                            selected={selectedFlavours}
                            onToggle={(tag: string) =>
                                setSelectedFlavours(prev =>
                                    prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                                )}
                            color="bg-yellow-500"
                            borderColor="border-yellow-500"
                        />
                        {filteredRecipes.length > 0 && (
                            <Text className="text-lg font-semibold my-3 px-4">
                                Results ({filteredRecipes.length})
                            </Text>
                        )}
                    </View>
                }
                renderItem={renderRecipeItem}
                ListEmptyComponent={
                    <View style={styles.emptyListContainerModal}>
                        <Text className="text-center text-gray-500">
                            {loading ? "Loading..." : (
                                (query.trim() === '' && !selectedCuisine && selectedCategories.length === 0 && selectedFlavours.length === 0)
                                    ? "Type to search or apply filters."
                                    : "No recipes found matching your criteria."
                            )}
                        </Text>
                    </View>
                }
                // No "Done" button needed, user navigates back using header back button
                // "Reset Filters" can still be useful
                ListFooterComponent={
                    <View style={styles.buttonRowModal}>
                        <TouchableOpacity onPress={resetFilters} style={styles.resetButtonModal}>
                            <Text className="text-center text-red-600 font-semibold">Reset Filters</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#fff', // Or your preferred background
        paddingTop: 0, // Header will provide padding if shown
    },
    emptyListContainerModal: { // Renamed to avoid conflict if styles are merged
        paddingTop: 60,
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    buttonRowModal: { // Renamed
        paddingHorizontal: 16,
        paddingVertical: 20,
        justifyContent: 'center', // Center the reset button if it's the only one
    },
    resetButtonModal: { // Renamed
        padding: 10,
        borderWidth: 1,
        borderColor: 'rgb(220 38 38)',
        borderRadius: 8,
        // flex: 1, // Not needed if it's the only button
    },
});