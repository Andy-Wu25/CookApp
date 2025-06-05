export type Recipe = {
    id: string;
    name: string;
    image_url: string;
    ingredients: string[];
    steps: string[];
    cuisine: string;
    category: string[];
    flavour?: string[];
    difficulty: string;
};

export const CUISINE_TAGS_UI = [
    'Western🤠',
    'Asian🥢',
    'Chinese🇨🇳',
    'Thai🇹🇭',
    'Mexican🇲🇽',
    'Italian🇮🇹',
    'Korean🇰🇷',
    'Middle Eastern🥙',
    'Indian🇮🇳',
    'Japanese🇯🇵'
];
export const CATEGORY_TAGS_UI = ['Meat🥩', 'Vegetarian🥬', 'Seafood🐟', 'Dessert🍰', 'Vegan🌱'];
export const FLAVOUR_TAGS_UI = ['Spicy🌶️', 'Sweet🍭', 'Sour🍋', 'Savoury🍽️'];