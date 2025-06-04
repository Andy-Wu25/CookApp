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