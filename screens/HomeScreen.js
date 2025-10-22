import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Alert, Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '../supabase';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [drug1, setDrug1] = useState('');
  const [drug2, setDrug2] = useState('');
  const [userIdShort, setUserIdShort] = useState('');
  const [username, setUsername] = useState('');

  const mockCheckInteraction = async () => {
    if (!drug1.trim() || !drug2.trim()) {
      Alert.alert('Missing Input', 'Please enter values for both fields before continuing.');
      return; // stop navigation
    }
    // Mock delay and fake result
    const result = await new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            risk: 'Moderate',
            description: `Combining ${drug1} and ${drug2} may increase drowsiness.`,
          }),
        800
      )
    );
    navigation.navigate('Result', { drug1, drug2, result });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const logoSource = Platform.OS === 'web' ? { uri: '/logo.png' } : require('../assets/logo.png');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        const user = userData?.user;
        if (user?.id) {
          // Fetch username from 'profiles' table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();

          if (profileError) throw profileError;

          setUsername(profile?.username || 'User');
        }
      } catch (error) {
        console.error('Error fetching username:', error);
        setUsername('User');
      }
    };

    fetchUsername();
  }, []);

  //------------------------------------------------------------------------------------------
  // Function: useLayoutEffect
  // Description:  Used to add logo and username to navigation bar on home
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <Image
          source={logoSource}
          style={{ width: 40, height: 40, marginLeft: 16 }}
          resizeMode="contain"
        />
      ),
      headerRight: () => (
        <Text style={{ marginRight: 16, fontWeight: 'bold', color: '#36ada7' }}>
          {username ? `@${username}` : ''}
        </Text>
      ),
    });
  }, [navigation, username]);

  //------------------------------------------------------------------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check Interactions</Text>
      <TextInput
        style={styles.input}
        placeholder="First Drug"
        value={drug1}
        onChangeText={setDrug1}
      />
      <Ionicons name="add-circle-outline" size={32} color="#36ada7" style={styles.icon} />
      <TextInput
        style={[styles.input, { marginBottom: 40 }]}
        placeholder="Second Drug"
        value={drug2}
        onChangeText={setDrug2}
      />

      <Pressable 
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]} 
        onPress={mockCheckInteraction}
        >
        <Text style={styles.buttonText}>Check for Interactions</Text>
      </Pressable>    
      
      <View style={{ marginTop: 10 }} />
      <Pressable style={styles.button} onPress={() => navigation.navigate('History')}>
        <Text style={styles.buttonText}>View History</Text>
      </Pressable>
        
      <View style={{ marginTop: 10 }} />
      <Pressable style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </Pressable>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    marginTop: 20,
    color: '#45474C',
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#36ada7',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    maxWidth: 300,
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
  signOutButton: {
    backgroundColor: '#b71c1c',  // red
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
  signOutButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
  buttonPressed: {
    opacity: 0.7,
  }
});
