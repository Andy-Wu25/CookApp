import { ImageSourcePropType } from 'react-native';

export type Recipe = {
    id: string;
    name: string;
    image: ImageSourcePropType;
    ingredients: string[];
    steps: string[];
    cuisine: string;
    category: string;
    difficulty: string;
};

export const recipes: Recipe[] = [
    {
        id: '1',
        name: 'Garlic Butter Chicken',
        image: require('../assets/images/1.jpg'),
        ingredients: ['chicken breast', 'garlic', 'butter', 'salt', 'pepper'],
        steps: [
            'Season the chicken.',
            'Heat butter and garlic in a pan.',
            'Cook chicken on medium heat until golden.',
        ],
        cuisine: 'Western',
        category: 'Meat🥩',
        difficulty: 'Easy',
    },
    {
        id: '2',
        name: 'Vegetable Stir Fry',
        image: require('../assets/images/2.jpg'),
        ingredients: ['broccoli', 'carrot', 'soy sauce', 'garlic', 'onion'],
        steps: [
            'Heat oil in a wok.',
            'Add vegetables and stir-fry for 5 minutes.',
            'Add soy sauce and cook 2 more minutes.',
        ],
        cuisine: 'Asian',
        category: 'Vegetarian🥗',
        difficulty: 'Easy',
    },
    {
        id: '3',
        name: 'Spaghetti Bolognese',
        image: require('../assets/images/3.jpeg'),
        ingredients: ['spaghetti', 'ground beef', 'tomato sauce', 'onion', 'garlic', 'olive oil'],
        steps: [
            'Boil the spaghetti until al dente.',
            'Cook onion and garlic in olive oil.',
            'Add ground beef and brown.',
            'Pour in tomato sauce and simmer.',
            'Serve sauce over spaghetti.',
        ],
        cuisine: 'Italian',
        category: 'Pasta🍝',
        difficulty: 'Medium',
    },
    {
        id: '4',
        name: 'Beef Stir-Fry',
        image: require('../assets/images/4.jpg'),
        ingredients: ['beef slices', 'soy sauce', 'bell pepper', 'onion', 'garlic', 'cornstarch'],
        steps: [
            'Marinate beef in soy sauce and cornstarch.',
            'Stir-fry garlic and onion.',
            'Add beef and cook until browned.',
            'Add bell pepper and cook briefly.',
        ],
        cuisine: 'Chinese',
        category: 'Meat🥩',
        difficulty: 'Easy',
    },
    {
        id: '5',
        name: 'Chicken Tikka Masala',
        image: require('../assets/images/5.jpg'),
        ingredients: ['chicken breast', 'yogurt', 'garam masala', 'tomato puree', 'cream'],
        steps: [
            'Marinate chicken in yogurt and spices.',
            'Grill or sear the chicken.',
            'Cook tomato puree with spices.',
            'Add chicken and cream, simmer until thick.',
        ],
        cuisine: 'Indian',
        category: 'Meat🥩',
        difficulty: 'Medium',
    },
    {
        id: '6',
        name: 'Vegetable Fried Rice',
        image: require('../assets/images/6.jpg'),
        ingredients: ['cooked rice', 'carrots', 'peas', 'eggs', 'soy sauce', 'green onion'],
        steps: [
            'Scramble eggs and set aside.',
            'Stir-fry vegetables.',
            'Add rice and soy sauce.',
            'Stir in eggs and green onion.',
        ],
        cuisine: 'Asian',
        category: 'Vegetarian🥬',
        difficulty: 'Easy',
    },
    {
        id: '7',
        name: 'Salmon Teriyaki',
        image: require('../assets/images/7.jpg'),
        ingredients: ['salmon fillet', 'soy sauce', 'mirin', 'sugar', 'garlic'],
        steps: [
            'Mix soy sauce, mirin, sugar, and garlic to make sauce.',
            'Marinate salmon briefly.',
            'Cook salmon in a pan until crispy.',
            'Add sauce and simmer until glazed.',
        ],
        cuisine: 'Japanese',
        category: 'Seafood🐟',
        difficulty: 'Easy',
    },

    {
        id: '8',
        name: 'Shakshuka',
        image: require('../assets/images/8.jpg'),
        ingredients: ['eggs', 'tomatoes', 'onion', 'garlic', 'bell pepper', 'paprika'],
        steps: [
            'Sauté onion, garlic, and bell pepper.',
            'Add tomatoes and paprika, simmer until thick.',
            'Make wells and crack eggs in.',
            'Cover and cook until eggs are set.',
        ],
        cuisine: 'Middle Eastern',
        category: 'Vegetarian🥬',
        difficulty: 'Easy',
    },
    {
        id: '9',
        name: 'Beef Tacos',
        image: require('../assets/images/9.jpg'),
        ingredients: ['taco shells', 'ground beef', 'onion', 'tomato', 'lettuce', 'cheese'],
        steps: [
            'Cook beef with onion and seasoning.',
            'Warm taco shells.',
            'Fill with beef, lettuce, tomato, and cheese.',
        ],
        cuisine: 'Mexican',
        category: 'Meat🥩',
        difficulty: 'Easy',
    },
    {
        id: '10',
        name: 'Pad Thai',
        image: require('../assets/images/10.jpg'),
        ingredients: ['rice noodles', 'shrimp', 'egg', 'bean sprouts', 'peanuts', 'tamarind paste'],
        steps: [
            'Soak rice noodles in warm water.',
            'Sauté shrimp and set aside.',
            'Scramble egg, then add noodles and sauce.',
            'Mix in bean sprouts and top with peanuts.',
        ],
        cuisine: 'Thai',
        category: 'Seafood🐟',
        difficulty: 'Medium',
    },

];
