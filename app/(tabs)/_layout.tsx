import { Tabs } from "expo-router";
import React from 'react';
import { Text, Platform, TextStyle } from 'react-native'; // For custom tabBarLabel
import Ionicons from 'react-native-vector-icons/Ionicons'; // Or: import { Ionicons } from '@expo/vector-icons';


const TabLayout = () => {
    const activeColor = 'tomato';
    const inactiveColor = 'grey';
    const tabBarBackgroundColor = '#0f0D23';

    // Helper function for consistent label styling
    const getLabelStyle = (focused: boolean, color: string): TextStyle => ({
        color,
        fontSize: 10,
        fontWeight: focused ? 'bold' : 'normal',
        paddingBottom: 5,
    });

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: activeColor,
                tabBarInactiveTintColor: inactiveColor,
                tabBarStyle: {
                    backgroundColor: tabBarBackgroundColor,
                    height: 70,
                    borderTopWidth: 1,
                    borderTopColor: '#232533',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Recipes',
                    tabBarIcon: ({ focused, color, size }) => {
                        const iconName = focused ? 'home' : 'home-outline';
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarLabel: ({ focused, color, children }) => ( // children is 'Home' from title
                        <Text style={getLabelStyle(focused, color)}>{children}</Text>
                    ),
                }}
            />

            <Tabs.Screen
                name="search"
                options={{
                    title: 'Discover',
                    tabBarIcon: ({ focused, color, size }) => {
                        const iconName = focused ? 'search' : 'search-outline';
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarLabel: ({ focused, color, children }) => (
                        <Text style={getLabelStyle(focused, color)}>{children}</Text>
                    ),
                }}
            />

            <Tabs.Screen
                name="saved"
                options={{
                    title: 'Saved',
                    tabBarIcon: ({ focused, color, size }) => {
                        // Using 'bookmark' as an example for 'saved'
                        const iconName = focused ? 'bookmark' : 'bookmark-outline';
                        // Other options: 'heart'/'heart-outline', 'star'/'star-outline'
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarLabel: ({ focused, color, children }) => (
                        <Text style={getLabelStyle(focused, color)}>{children}</Text>
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused, color, size }) => {
                        const iconName = focused ? 'person' : 'person-outline';
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarLabel: ({ focused, color, children }) => (
                        <Text style={getLabelStyle(focused, color)}>{children}</Text>
                    ),
                }}
            />
        </Tabs>
    );
}
export default TabLayout;