import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ApiSetupScreenProps {
  onBack: () => void;
  onComplete: (keys: { openai: string; elevenlabs: string }) => void;
}

export function ApiSetupScreen({ onBack, onComplete }: ApiSetupScreenProps) {
  const [keys, setKeys] = useState({
    openai: '',
    elevenlabs: '',
  });
  const [showOpenai, setShowOpenai] = useState(false);
  const [showElevenlabs, setShowElevenlabs] = useState(false);

  const handleContinue = () => {
    if (!keys.openai.trim()) {
      Alert.alert('Missing API Key', 'Please enter your OpenAI API key to continue.');
      return;
    }
    onComplete(keys);
  };

  const handleSkip = () => {
    onComplete({ openai: 'demo', elevenlabs: 'demo' });
  };

  const isValid = keys.openai.length > 10 && keys.elevenlabs.length > 10;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-6">
        {/* Header */}
        <View className="flex-row items-center gap-4 mb-8">
          <TouchableOpacity
            onPress={onBack}
            className="w-10 h-10 rounded-full bg-muted/50 items-center justify-center"
          >
            <Text className="text-lg text-foreground">←</Text>
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-foreground">Setup API Keys</Text>
            <Text className="text-muted-foreground text-sm">Required for AI features</Text>
          </View>
        </View>

        {/* Info card */}
        <View className="bg-card/60 rounded-2xl p-4 mb-8 flex-row gap-3 border border-border/50">
          <Text className="text-primary text-lg">ℹ️</Text>
          <Text className="text-sm text-muted-foreground flex-1">
            Your API keys are stored locally on your device and are never sent to our servers.
          </Text>
        </View>

        {/* Form */}
        <View className="flex-1 space-y-6">
          {/* OpenAI Key */}
          <View className="space-y-3">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-xl bg-green-500 items-center justify-center">
                <Text className="text-white font-bold">🔑</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">OpenAI API Key</Text>
                <Text className="text-xs text-destructive">Required</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowOpenai(!showOpenai)}
                className="w-8 h-8 rounded-lg bg-muted/50 items-center justify-center"
              >
                <Text className="text-muted-foreground">{showOpenai ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            
            <View className="bg-card/60 rounded-xl border border-border/50">
              <TextInput
                className="w-full p-4 text-foreground"
                placeholder="sk-..."
                placeholderTextColor="#94a3b8"
                value={keys.openai}
                onChangeText={(text) => setKeys(prev => ({ ...prev, openai: text }))}
                secureTextEntry={!showOpenai}
              />
            </View>
            <Text className="text-xs text-muted-foreground">
              Get your API key from platform.openai.com
            </Text>
          </View>

          {/* ElevenLabs Key */}
          <View className="space-y-3">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-xl bg-purple-500 items-center justify-center">
                <Text className="text-white font-bold">🔊</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">ElevenLabs API Key</Text>
                <Text className="text-xs text-muted-foreground">Optional</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowElevenlabs(!showElevenlabs)}
                className="w-8 h-8 rounded-lg bg-muted/50 items-center justify-center"
              >
                <Text className="text-muted-foreground">{showElevenlabs ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            
            <View className="bg-card/60 rounded-xl border border-border/50">
              <TextInput
                className="w-full p-4 text-foreground"
                placeholder="Enter ElevenLabs API key"
                placeholderTextColor="#94a3b8"
                value={keys.elevenlabs}
                onChangeText={(text) => setKeys(prev => ({ ...prev, elevenlabs: text }))}
                secureTextEntry={!showElevenlabs}
              />
            </View>
            <Text className="text-xs text-muted-foreground">
              For premium voice synthesis (optional)
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View className="space-y-4 mt-8">
          <TouchableOpacity
            className={`w-full py-4 px-6 rounded-2xl ${
              isValid ? 'bg-primary' : 'bg-muted'
            }`}
            onPress={handleContinue}
            disabled={!keys.openai.trim()}
          >
            <Text className={`text-center text-lg font-semibold ${
              isValid ? 'text-primary-foreground' : 'text-muted-foreground'
            }`}>
              Continue
            </Text>
          </TouchableOpacity>

          {/* Skip Button */}
          <TouchableOpacity
            onPress={handleSkip}
            className="w-full py-3"
          >
            <Text className="text-center text-muted-foreground text-sm">
              Skip for now (demo mode)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
