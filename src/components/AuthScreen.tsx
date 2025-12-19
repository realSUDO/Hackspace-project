import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../services/supabase';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        if (data.user && !data.user.email_confirmed_at) {
          Alert.alert('Success', 'Check your email for verification link');
        } else {
          onAuthSuccess();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onAuthSuccess();
      }
    } catch (error: any) {
      console.log('Auth error:', error);
      let errorMessage = 'Authentication failed';
      
      if (error.message?.includes('Network request failed')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-8 bg-white">
      <Text className="text-3xl font-bold text-center mb-8">
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </Text>
      
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        className="bg-blue-500 rounded-lg py-3 mb-4"
        onPress={handleAuth}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold">
          {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text className="text-blue-500 text-center">
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}