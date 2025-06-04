// app/recipes/[id].tsx
import { Text, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { recipes } from '@/data/recipes';

export default function RecipeDetail() {
    const { id } = useLocalSearchParams();
    const recipe = recipes.find((r) => r.id === id);

    if (!recipe) {
        return <Text>Recipe not found</Text>;
    }

    return (
        <ScrollView className="p-4">
            <Image
                source={recipe.image}
                className="w-full h-60 rounded-lg mb-4"
                resizeMode="cover"
            />
            <Text className="text-2xl font-bold mb-2">{recipe.name}</Text>
            <Text className="text-gray-500 mb-4">{recipe.cuisine} • {recipe.category}</Text>

            <Text className="text-xl font-semibold mb-1">Ingredients:</Text>
            {recipe.ingredients.map((ingredient, index) => (
                <Text key={index}>• {ingredient}</Text>
            ))}

            <Text className="text-xl font-semibold mt-4 mb-1">Steps:</Text>
            {recipe.steps.map((step, index) => (
                <Text key={index}>{index + 1}. {step}</Text>
            ))}
        </ScrollView>
    );
}
