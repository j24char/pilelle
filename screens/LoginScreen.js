import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '../supabase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //------------------------------------------------------------------------------------------
  // Function: signIn
  // Description:  Uses email/password to sign in
  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert('Login failed', error.message);
  };

  //------------------------------------------------------------------------------------------
  // Function: handleForgotPassword
  // Description:  Sends the password reset email to the input email
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Missing email', 'Please enter your email address first.');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://pilelle.vercel.app/reset-password', // placeholder redirect URL
    });

    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Check your email', 'Password reset instructions have been sent.');
  };

  //------------------------------------------------------------------------------------------
  return (
    <View style={styles.container}>
      <Image source={require('../assets/icon.png')} style={styles.image} />
      <Text style={styles.title}>PELILLE</Text>
      <Text>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Text>Password</Text>
      <TextInput
        style={[styles.input, { marginBottom: 20 }]}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <Pressable style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>
      <Pressable onPress={handleForgotPassword}>
        <Text style={{ marginTop: 12, color: '#36ada7', textAlign: 'center' }}>
          Forgot your password?
        </Text>
      </Pressable>
      <View style={{ marginTop: 10 }} />

      <Pressable style={styles.button} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.buttonText}>Sign Up</Text>
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
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    color: '#36ada7',
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 30,
    borderRadius: 90, // makes it circular if image is square
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#36ada7',
    borderRadius: 10,
    padding: 10,
    marginVertical: 2,
  },
});
