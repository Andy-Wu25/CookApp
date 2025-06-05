import SearchBar from '@/components/SearchBar'; // Your SearchBar component
import { TagBar } from '@/components/TagBar'; // Your TagBar component
import { CATEGORY_TAGS_UI, CUISINE_TAGS_UI, FLAVOUR_TAGS_UI, Recipe } from '@/lib/recipe';
import { supabase } from '@/lib/supabase';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

// Remove emojis/flags for comparison
const getTagText = (tagWithPossibleEmoji: string): string =>
    tagWithPossibleEmoji?.replace(/[\u{1F300}-\u{1FAD6}\u{1F600}-\u{1F64F}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\uFE0F\uFE0E]/gu, '').trim();

export default function Index() {
    const router = useRouter();

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    const [query, setQuery] = useState('');
    const [searchActive, setSearchActive] = useState(false);

    const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedFlavours, setSelectedFlavours] = useState<string[]>([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('recipes').select('*');
            if (error) console.error('Fetch error:', error);
            else setRecipes(data || []);
            setLoading(false);
        };
        fetchRecipes();
    }, []);

    const filteredRecipes = recipes.filter((recipe) => {
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
        // Optionally reset query as well if desired:
        // setQuery('');
    };

    const renderRecipeItem = ({ item }: { item: Recipe }) => (
        <TouchableOpacity
            className="mb-4 bg-white p-4 rounded-xl shadow mx-4"
            onPress={() => {
                // 1. Navigate to the recipe page
                router.push(`/recipes/${item.id}`);

                // 2. Schedule the modal to close slightly after navigation starts.
                // This ensures the new screen is already transitioning in.
                // If searchActive is false, this does nothing, which is fine for main list clicks.
                if (searchActive) {
                    // Using a minimal timeout. Adjust if needed, or if it works without.
                    // The goal is for the setSearchActive(false) to happen
                    // after router.push has initiated the screen transition.
                    setTimeout(() => {
                        setSearchActive(false);
                    }, 50); // Small delay, e.g., 50-100ms. Test what feels best.
                    // Or even 0 might work if router.push is synchronous enough
                    // before the next render cycle for setSearchActive.
                }
            }}
        >
        <Image
            source={{ uri: item.image_url || undefined }}
            className="w-full h-40 rounded-lg"
            resizeMode="cover"
                />
                <Text className="text-xl font-semibold mt-2">{item.name || 'Unnamed Recipe'}</Text>
            <Text className="text-sm text-gray-500">
                {`${item.cuisine || 'N/A'} • ${
                    Array.isArray(item.category)
                        ? item.category.join(', ')
                        : item.category || 'N/A'
                }`}
            </Text>
            <Text className="text-sm text-green-600">{item.difficulty || 'N/A Difficulty'}</Text>
        </TouchableOpacity>
);

    return (
        <View style={styles.container}>
            <SearchBar
                placeholder="Search recipes..."
                value={query}
                onChangeText={() => {}}
                isDummy={true}
                onPressDummy={() => setSearchActive(true)}
            />

            <Modal
                visible={searchActive}
                animationType="slide"
                onRequestClose={() => setSearchActive(false)}
            >
                <View style={styles.modalContainer}>
                    <SearchBar
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search recipes..."
                        autoFocus
                    />

                    <FlatList
                        data={filteredRecipes}
                        keyExtractor={(item) => `modal-${item.id}`}
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
                            <View style={styles.modalEmptyListContainer}>
                                <Text className="text-center text-gray-500">
                                    {(query.trim() === '' && !selectedCuisine && selectedCategories.length === 0 && selectedFlavours.length === 0)
                                        ? "Type to search or apply filters."
                                        : "No recipes found matching your criteria."
                                    }
                                </Text>
                            </View>
                        }
                        ListFooterComponent={
                            <View style={[styles.buttonRow, { marginTop: filteredRecipes.length > 0 ? 10 : 30 }]}>
                                <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
                                    <Text className="text-center text-red-600 font-semibold">Reset Filters</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setSearchActive(false)} style={styles.doneButton}>
                                    <Text className="text-center text-white font-semibold">Done</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                </View>
            </Modal>

            {loading ? (
                <Text className="text-center mt-10">Loading recipes...</Text>
            ) : (
                <FlatList
                    data={query || selectedCuisine || selectedCategories.length > 0 || selectedFlavours.length > 0 ? filteredRecipes : recipes}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 24, paddingTop: 12 }}
                    ListEmptyComponent={
                        <View style={styles.emptyListContainer}>
                            <Text className="text-center text-gray-500">
                                {query || selectedCuisine || selectedCategories.length > 0 || selectedFlavours.length > 0
                                    ? "No recipes found matching your filters."
                                    : "No recipes available."
                                }
                            </Text>
                        </View>
                    }
                    renderItem={renderRecipeItem}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        paddingTop: 50,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
    },
    emptyListContainer: {
        paddingTop: 50,
        alignItems: 'center',
    },
    modalEmptyListContainer: {
        paddingTop: 60,
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        backgroundColor: '#fff',
    },
    resetButton: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'rgb(220 38 38)',
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
    },
    doneButton: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: '#22C55E',
        borderRadius: 8,
        flex: 1,
        marginLeft: 8,
    },
});