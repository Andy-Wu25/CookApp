import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router'; // Import useLocalSearchParams
import { supabase } from '@/lib/supabase';
import { Recipe, CUISINE_TAGS_UI, CATEGORY_TAGS_UI, FLAVOUR_TAGS_UI } from '@/lib/recipe';
import SearchBar from '@/components/SearchBar';
import { TagBar } from '@/components/TagBar';
import { TagState, cycleTagState } from '@/components/TagState';

const getTagText = (tagWithPossibleEmoji: string): string =>
    tagWithPossibleEmoji?.replace(/[\u{1F300}-\u{1FAD6}\u{1F600}-\u{1F64F}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\uFE0F\uFE0E]/gu, '').trim();

export default function SearchScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters and Query for this screen
    const [query, setQuery] = useState(typeof params.initialQuery === 'string' ? params.initialQuery : '');
    const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedFlavours, setSelectedFlavours] = useState<string[]>([]);

    const [cuisineStates, setCuisineStates] = useState<Record<string, TagState>>({});
    const [categoryStates, setCategoryStates] = useState<Record<string, TagState>>({});
    const [flavourStates, setFlavourStates] = useState<Record<string, TagState>>({});

    // Fetch all recipes
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


    const toggleTag = (
        tag: string,
        stateUpdater: React.Dispatch<React.SetStateAction<Record<string, TagState>>>
    ) => {
        stateUpdater((prev) => ({
            ...prev,
            [tag]: cycleTagState(prev[tag] || null),
        }));
    };

    const matchesMultiStateTags = (recipeTags: string[], tagStates: Record<string, TagState>) => {
        const includes = Object.keys(tagStates).filter((k) => tagStates[k] === 'include');
        const excludes = Object.keys(tagStates).filter((k) => tagStates[k] === 'exclude');
        const normalizedTags = recipeTags.map((t) => getTagText(t || '').toLowerCase());

        const includeMatch = includes.length === 0 || includes.every(tag =>
            normalizedTags.includes(getTagText(tag).toLowerCase())
        );
        const excludeMatch = excludes.every(tag =>
            !normalizedTags.includes(getTagText(tag).toLowerCase())
        );

        return includeMatch && excludeMatch;
    };

    const filteredRecipes = allRecipes.filter((recipe) => {
        const matchesQuery = query.trim() === ''
            || recipe.name?.toLowerCase().includes(query.toLowerCase())
            || recipe.ingredients?.some((i) => i.toLowerCase().includes(query.toLowerCase()));

        const matchesCuisine = matchesMultiStateTags(
            recipe.cuisine ? [recipe.cuisine] : [],
            cuisineStates
        );

        const matchesCategories = matchesMultiStateTags(
            Array.isArray(recipe.category) ? recipe.category : recipe.category ? [recipe.category] : [],
            categoryStates
        );

        const matchesFlavours = matchesMultiStateTags(
            Array.isArray(recipe.flavour) ? recipe.flavour : recipe.flavour ? [recipe.flavour] : [],
            flavourStates
        );

        return matchesQuery && matchesCuisine && matchesCategories && matchesFlavours;
    });


    const resetFilters = () => {
        setCuisineStates({});
        setCategoryStates({});
        setFlavourStates({});
        setQuery('');
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
            { /* Header for the search screen */}
            <Stack.Screen options={{ title: 'Search', headerShown: true }} />
            <View style={styles.searchRow}>
                <View style={{ flex: 1 }}>
                    <SearchBar
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search recipes..."
                        autoFocus
                    />
                </View>

                <TouchableOpacity onPress={resetFilters} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>✕</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={filteredRecipes}
                keyExtractor={(item) => `search-recipe-${item.id}`}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                ListHeaderComponent={
                    <View style={{ paddingHorizontal: 0 }}>
                        <TagBar
                            title="Cuisine"
                            tags={CUISINE_TAGS_UI}
                            selected={cuisineStates}
                            onToggle={(tag) => toggleTag(tag, setCuisineStates)}
                        />
                        <TagBar
                            title="Category"
                            tags={CATEGORY_TAGS_UI}
                            selected={categoryStates}
                            onToggle={(tag) => toggleTag(tag, setCategoryStates)}
                        />
                        <TagBar
                            title="Flavour"
                            tags={FLAVOUR_TAGS_UI}
                            selected={flavourStates}
                            onToggle={(tag) => toggleTag(tag, setFlavourStates)}
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
                                    ? "No recipes found matching your criteria."
                                    : "No recipes found matching your criteria."
                            )}
                        </Text>
                    </View>
                }

            />
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 0,
    },
    emptyListContainerModal: {
        paddingTop: 50,
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    buttonRowModal: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        justifyContent: 'center',
    },
    resetButtonModal: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'rgb(220 38 38)',
        borderRadius: 8,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 12,
    },

    clearButton: {
        marginLeft: 8,
        padding: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    clearButtonText: {
        fontSize: 25,
        color: '#ab4c4c', // red-600
        fontWeight: '900', // maximum weight
    },
});