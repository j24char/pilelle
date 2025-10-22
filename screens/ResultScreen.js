import { View, Text, Pressable, StyleSheet } from 'react-native';
import { supabase } from '../supabase';
import { useLayoutEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function ResultScreen({ route, navigation }) {
  const { drug1, drug2, result } = route.params;

  //------------------------------------------------------------------------------------------
  // Function: useLayoutEffect
  // Description:  Used to add navigation to return to home screen rather than previous screen
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            })
          }
          style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color="#36ada7" />
          <Text style={{ color: '#36ada7', fontSize: 16 }}>Home</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  //------------------------------------------------------------------------------------------
  // Function: saveResult
  // Description:  Inserts a new record into database, then gets all records for user
  //   by most recent data, and deletes any records past the threshold.
  const saveResult = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Error getting user:', userError);
        return;
      }

      // Step 1: Insert new record
      const { error: insertError } = await supabase.from('interaction_history').insert([
        {
          user_id: user.id,
          drug1,
          drug2,
          result: result.risk,
          description: result.description,
          created_at: new Date(), // optional: ensure timestamps for ordering
        },
      ]);

      if (insertError) {
        console.error('Insert error:', insertError);
        return;
      }

      // Step 2: Fetch all records (newest first)
      const { data: records, error: fetchError } = await supabase
        .from('interaction_history')
        .select('id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        return;
      }

      // Step 3: Delete anything beyond the 10 most recent
      if (records.length > 3) {
        const idsToDelete = records.slice(3).map((r) => r.id);

        const { error: deleteError } = await supabase
          .from('interaction_history')
          .delete()
          .in('id', idsToDelete);

        if (deleteError) {
          console.error('Prune error:', deleteError);
        }
      }

      // Step 4: Navigate to History screen
      navigation.navigate('History');
    } catch (error) {
      console.error('Unexpected error in saveResult:', error);
    }
  };

  //------------------------------------------------------------------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Interaction Result</Text>
      <Text style={styles.text}>Drugs: {drug1} + {drug2}</Text>
      <Text style={styles.text}>Risk Level: {result.risk}</Text>
      <Text style={styles.text}>Details: {result.description}</Text>
      <View style={{ marginTop: 20 }} />
      
      <Pressable style={styles.button} onPress={saveResult}>
        <Text style={styles.buttonText}>Save Result</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#00695c',
  },
  text: {
    fontSize: 16,
    marginVertical: 4,
  },
  button: {
    backgroundColor: '#36ada7',  // soft desaturated blue
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '80%',
    maxWidth: 300,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },
});
