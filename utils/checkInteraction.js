import { supabase } from '../supabase';

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
    console.error('Supabase error:', error);
    return [];
  }

  // Ensure data is an array, not null
  if (!Array.isArray(data)) {
    console.warn('Unexpected response from Supabase:', data);
    return [];
  }

  return data.map(item => ({
    result: item.effect || 'Unknown',
    description:
      item.conclusion || item.result || item.note || 'No details available.',
    drug: item.drug_name,
    food: item.food_herb_name,
  }));
}
