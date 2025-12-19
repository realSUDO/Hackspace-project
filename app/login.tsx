import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { supabase } from '../src/services/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: undefined, // Disable email confirmation redirect
          }
        });
        if (error) throw error;
        
        // Try to sign in immediately (works if email confirmation is disabled)
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          Alert.alert('Account Created', 'Please check your email to verify your account, then sign in.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#1e293b', '#0f172a', '#020617']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center items-center p-6">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-white text-center mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Text>
            <Text className="text-gray-400 text-center">
              {isSignUp ? 'Sign up to get started' : 'Sign in to continue'}
            </Text>
          </View>

          <View className="w-full space-y-4 mb-8">
            <BlurView intensity={40} className="rounded-2xl overflow-hidden border border-gray-600">
              <View className="p-4">
                <Text className="text-white font-medium mb-2">Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#64748b"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="text-white text-lg"
                />
              </View>
            </BlurView>

            <BlurView intensity={40} className="rounded-2xl overflow-hidden border border-gray-600">
              <View className="p-4">
                <Text className="text-white font-medium mb-2">Password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#64748b"
                  secureTextEntry
                  className="text-white text-lg"
                />
              </View>
            </BlurView>
          </View>

          <TouchableOpacity onPress={handleAuth} disabled={isLoading} className="w-full mb-4">
            <LinearGradient
              colors={['#3b82f6', '#1d4ed8']}
              className="rounded-2xl p-4"
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text className="text-gray-400 text-center">
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
