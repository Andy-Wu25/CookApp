const { createClient } = require('@supabase/supabase-js');
const { recipes } = require('../data/recipes.js');

const supabaseUrl = 'https://hyphvhyngrqpkgjmrvdm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cGh2aHluZ3JxcGtnam1ydmRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTI3MDgsImV4cCI6MjA2NDYyODcwOH0.U_8mhdbVypDyesYWvcvF29VDfcLzHrP7RrECu_MTo-M';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const getImageUrl = (id) =>
    `${supabaseUrl}/storage/v1/object/public/recipe-images/${id}.jpg`;

const uploadRecipes = async () => {
    for (const recipe of recipes) {
        const { id, image, ...rest } = recipe;

        const { error } = await supabase.from('recipes').insert({
            id,
            ...rest,
            image_url: getImageUrl(id),
        });

        if (error) {
            console.error(`❌ Failed to insert recipe ${recipe.name}`, error);
        } else {
            console.log(`✅ Inserted recipe: ${recipe.name}`);
        }
    }

    console.log('🎉 Upload finished');
};

uploadRecipes();
