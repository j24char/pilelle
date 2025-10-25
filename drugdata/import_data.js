// Usage: node .\import_data.js
// Note:  The file name is hard-coded.  Also, the supabase service key must be copied from supabase - DO NOT SAVE IT IN THIS FILE

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// -----------------------------
// Supabase configuration
// -----------------------------
const SUPABASE_URL = 'https://kkmmvpapmaecnfzjizlv.supabase.co';
const SUPABASE_SERVICE_KEY = '...'; // Use Service Role key for inserts
const TABLE_NAME = 'food_drug_interactions'; // Your table name

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// -----------------------------
// Read JSON file
// -----------------------------
const filePath = './interactions_cleaned.json'; // Path to your JSON file
console.log('Reading JSON file...');
let jsonData;
try {
  jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`✅ Loaded ${jsonData.length} records from JSON`);
} catch (err) {
  console.error('Error reading JSON file:', err);
  process.exit(1);
}

// -----------------------------
// Helper: Map keys to lowercase
// -----------------------------
function mapKeysToLower(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key.toLowerCase(), value])
  );
}

const dataLowercase = jsonData.map(mapKeysToLower);

// -----------------------------
// Insert in batches
// -----------------------------
const BATCH_SIZE = 500; // Adjust if needed
async function insertBatches() {
  console.log('Starting batch inserts...');
  for (let i = 0; i < dataLowercase.length; i += BATCH_SIZE) {
    const chunk = dataLowercase.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from(TABLE_NAME)
      .insert(chunk);

    if (error) {
      console.error(`❌ Error inserting batch ${i / BATCH_SIZE + 1}:`, error);
    } else {
      console.log(`✅ Inserted batch ${i / BATCH_SIZE + 1} (${chunk.length} rows)`);
    }
  }
  console.log('🎉 All batches inserted!');
}

// Run the import
insertBatches();
