import { supabase } from '../supabase';

// export async function checkInteractions(searchText) {
//   if (!searchText) return [];

//   const columns = [
//     'drug_name',
//     'brand_name',
//     'food_herb_name',
//     'component',
//     'note',
//     'result',
//     'effect',
//     'conclusion',
//   ];

//   // Build the OR filter for ilike
//   const filterQuery = columns.map(col => `${col}.ilike.%${searchText}%`).join(',');

//   console.log('Supabase OR filter:', filterQuery); // <-- Debug

//   const { data, error } = await supabase
//     .from('food_drug_interactions')
//     .select('*')
//     .or(filterQuery);

//   if (error) {
//     console.error('Error querying interactions:', error);
//   } else {
//     console.log('Supabase returned', data.length, 'rows'); // <-- Debug
//   }

//   return data;
// }


export async function checkInteractions(searchText) {
  if (!searchText) return [];

  const columns = [
    'drug_name',
    'brand_name',
    'food_herb_name',
    'component',
    'note',
    'result',
    'effect',
    'conclusion',
    'reference',
  ];

  const filterQuery = columns.map(col => `${col}.ilike.%${searchText}%`).join(',');

  const { data, error } = await supabase
    .from('food_drug_interactions')
    .select('*')
    .or(filterQuery);

  if (error) {
    console.error('Error querying interactions:', error);
    return [];
  }

  // Transform results to UI format
  const results = data.map(item => ({
    result: item.effect || 'Unknown',
    description:
      item.conclusion ||
      item.result ||
      item.note ||
      'No additional information available.',
    drug: item.drug_name,
    food: item.food_herb_name,
  }));

  console.log('Parsed results:', results.length);
  return results;
}
