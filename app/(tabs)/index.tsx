import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router'; // Link might still be useful for direct recipe links
import { supabase } from '@/lib/supabase';
import { Recipe } from '@/lib/recipe'; // Removed unused tag UI constants
import SearchBar from '@/components/SearchBar';
// TagBar and specific tag UI constants are no longer needed here if filters are only on search.tsx

const getTagText = (tagWithPossibleEmoji: string): string => // Keep if used for display
    tagWithPossibleEmoji?.replace(/[\u{1F300}-\u{1FAD6}\u{1F600}-\u{1F64F}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\uFE0F\uFE0E]/gu, '').trim();

export default function Index() {
    const router = useRouter();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [queryForMainList, setQueryForMainList] = useState(''); // If you want a quick search on main list before going to full search

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

    // Optional: Simple filtering for the main list if desired
    const mainListFilteredRecipes = recipes.filter((recipe) =>
        queryForMainList.trim() === '' ||
        recipe.name?.toLowerCase().includes(queryForMainList.toLowerCase()) ||
        recipe.ingredients?.some((i) => i.toLowerCase().includes(queryForMainList.toLowerCase()))
    );

    const renderRecipeItem = ({ item }: { item: Recipe }) => (
        // Using Link here is fine for direct navigation from the main list
        <Link href={`/recipes/${item.id}`} asChild>
            <TouchableOpacity
                className="mb-4 bg-white p-4 rounded-xl shadow mx-4"
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
        </Link>
    );

    return (
        <View style={styles.container}>
            <SearchBar
                placeholder="Search recipes..."
                value={queryForMainList} // Could be used for initial query on search screen
                // onChangeText={setQueryForMainList} // If you want live filtering on index before navigating
                isDummy={true} // Still acts as a trigger
                onPressDummy={() => router.push({ pathname: '/search', params: { initialQuery: queryForMainList } })}
            />

            {/* No Modal here anymore */}

            {loading ? (
                <Text className="text-center mt-10">Loading recipes...</Text>
            ) : (
                <FlatList
                    data={mainListFilteredRecipes} // Use the optionally filtered main list
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 24, paddingTop: 12 }}
                    ListEmptyComponent={
                        <View style={styles.emptyListContainer}>
                            <Text className="text-center text-gray-500">
                                {queryForMainList ? "No recipes found for your search." : "No recipes available."}
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
    emptyListContainer: {
        paddingTop: 50,
        alignItems: 'center',
    },
    // Removed modal-specific styles if they aren't used elsewhere
});