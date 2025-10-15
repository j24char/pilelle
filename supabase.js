import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = 'https://kkmmvpapmaecnfzjizlv.supabase.co'

const supabaseKey = Constants.expoConfig.extra.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey)
