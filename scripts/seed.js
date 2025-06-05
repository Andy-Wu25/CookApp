// seed.js

const { createClient } = require('@supabase/supabase-js');
const { recipes: sourceRecipes } = require('../data/recipes.js'); // Adjust path if needed

// --- Helper to strip emojis ---
const getTagText = (tagWithPossibleEmoji) => {
    if (!tagWithPossibleEmoji) return '';
    return tagWithPossibleEmoji.replace(/[\u{1F300}-\u{1FAD6}\u{1F600}-\u{1F64F}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\uFE0F\uFE0E]/gu, '').trim();
};

const supabaseUrl = 'https://hyphvhyngrqpkgjmrvdm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cGh2aHluZ3JxcGtnam1ydmRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTI3MDgsImV4cCI6MjA2NDYyODcwOH0.U_8mhdbVypDyesYWvcvF29VDfcLzHrP7RrECu_MTo-M'; // Use environment variable for production
// IMPORTANT: The Anon Key is generally safe for client-side use.
// However, for a seeding script that might have elevated privileges if you were using a service_role key
// (WHICH YOU ARE NOT DOING HERE, and that's good for this simple upload),
// always be mindful of key exposure. For simple data upload with anon key, it's fine.

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// This function will now use the Supabase-generated ID
const getImageUrl = (supabaseGeneratedId) =>
    `${supabaseUrl}/storage/v1/object/public/recipe-images/${supabaseGeneratedId}.jpg`;

const seed = async () => {
    console.log(`Starting upload for ${sourceRecipes.length} recipes...`);

    for (const localRecipe of sourceRecipes) {
        // Destructure, we don't need localRecipe.id or localRecipe.image for insertion now
        const { id: localMockId, image, category, flavour, ...restOfLocalRecipe } = localRecipe;

        const recipeDataToInsert = {
            ...restOfLocalRecipe, // name, ingredients, steps, cuisine, difficulty
            category: Array.isArray(category) ? category.map(cat => getTagText(cat || '')) : [],
            flavour: Array.isArray(flavour) ? flavour.map(flav => getTagText(flav || '')) : [],
            // image_url will be added in the update step
        };

        // Step 1: Insert recipe data (without image_url) and get the new record back
        const { data: insertedData, error: insertError } = await supabase
            .from('recipes')
            .insert(recipeDataToInsert)
            .select() // Crucial: .select() returns the inserted row(s), including the new ID
            .single(); // Assuming you insert one at a time and want a single object back

        if (insertError || !insertedData) {
            console.error(`❌ Failed to insert recipe (initial): ${localRecipe.name}`, insertError?.message || 'No data returned');
            continue; // Skip to the next recipe
        }

        const supabaseGeneratedId = insertedData.id;
        const finalImageUrl = getImageUrl(supabaseGeneratedId);

        // Step 2: Update the recipe with the image_url
        const { error: updateError } = await supabase
            .from('recipes')
            .update({ image_url: finalImageUrl })
            .eq('id', supabaseGeneratedId);

        if (updateError) {
            console.error(`❌ Failed to update image_url for recipe: ${localRecipe.name} (ID: ${supabaseGeneratedId})`, updateError.message);
        } else {
            console.log(`✅ Inserted and updated recipe: ${localRecipe.name} (Supabase ID: ${supabaseGeneratedId})`);
        }
    }

    console.log('🎉 Upload finished');
};

seed()
    .then(() => console.log('Script finished successfully.'))
    .catch((err) => console.error('Script failed with error:', err));