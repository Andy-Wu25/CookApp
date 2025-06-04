import React from 'react';
import { Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { recipes } from '@/data/recipes';


export default function Index() {
  return (
      <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
              <Link href={`/recipes/${item.id}`} asChild>
                  <TouchableOpacity className="mb-4 bg-white p-4 rounded-xl shadow">
                      <Image
                          source={item.image}
                          className="w-full h-40 rounded-lg"
                          resizeMode="cover"
                      />
                      <Text className="text-xl font-semibold mt-2">{item.name}</Text>
                      <Text className="text-sm text-gray-500">{item.cuisine} • {item.category}</Text>
                      <Text className="text-sm text-green-600">{item.difficulty}</Text>
                  </TouchableOpacity>
              </Link>
          )}
      />
  );
}
