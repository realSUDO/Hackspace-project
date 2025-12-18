import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface ApiSetupScreenProps {
  onBack: () => void;
  onComplete: (keys: { openai: string; elevenlabs: string; veryfi?: { clientId: string; username: string; apiKey: string } }) => void;
}

export function ApiSetupScreen({ onBack, onComplete }: ApiSetupScreenProps) {
  const [keys, setKeys] = useState({
    openai: '',
    elevenlabs: '',
    veryfi: { clientId: '', username: '', apiKey: '' }
  });
  const [showOpenai, setShowOpenai] = useState(false);
  const [showElevenlabs, setShowElevenlabs] = useState(false);
  const [showVeryfi, setShowVeryfi] = useState(false);

  const handleContinue = () => {
    if (!keys.openai.trim()) {
      Alert.alert('Missing API Key', 'Please enter your OpenAI API key to continue.');
      return;
    }
    onComplete({
      openai: keys.openai,
      elevenlabs: keys.elevenlabs,
      veryfi: keys.veryfi.clientId ? keys.veryfi : undefined
    });
  };

  const handleSkip = () => {
    onComplete({ openai: 'demo', elevenlabs: 'demo' });
  };

  return (
    <View className="flex-1 bg-background">
      {/* Background glow effects */}
      <View className="absolute top-1/4 left-1/2 w-96 h-96 rounded-full bg-primary/5 -translate-x-1/2 pointer-events-none" />
      <View className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-secondary/10 pointer-events-none" />
      
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
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

          <BlurView intensity={15} className="rounded-2xl overflow-hidden mb-6">
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              className="p-4 flex-row gap-3"
            >
              <Text className="text-primary text-lg">ℹ️</Text>
              <Text className="text-sm text-muted-foreground flex-1">
                Your API keys are stored locally on your device and are never sent to our servers.
              </Text>
            </LinearGradient>
          </BlurView>

          <View className="space-y-6 mb-8">
            <BlurView intensity={15} className="rounded-2xl overflow-hidden">
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                className="p-6"
              >
                <View className="flex-row items-center gap-3 mb-4">
                  <View className="w-10 h-10 rounded-xl bg-green-500/80 items-center justify-center">
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
                <Text className="text-xs text-muted-foreground mt-2">
                  Get your API key from platform.openai.com
                </Text>
              </LinearGradient>
            </BlurView>

            <BlurView intensity={15} className="rounded-2xl overflow-hidden">
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                className="p-6"
              >
                <View className="flex-row items-center gap-3 mb-4">
                  <View className="w-10 h-10 rounded-xl bg-purple-500/80 items-center justify-center">
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
                <Text className="text-xs text-muted-foreground mt-2">
                  For premium voice synthesis (optional)
                </Text>
              </LinearGradient>
            </BlurView>

            <BlurView intensity={15} className="rounded-2xl overflow-hidden">
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                className="p-6"
              >
                <View className="flex-row items-center gap-3 mb-4">
                  <View className="w-10 h-10 rounded-xl bg-blue-500/80 items-center justify-center">
                    <Text className="text-white font-bold">📷</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-foreground">Veryfi OCR</Text>
                    <Text className="text-xs text-muted-foreground">Optional - for medicine scanning</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setShowVeryfi(!showVeryfi)}
                    className="w-8 h-8 rounded-lg bg-muted/50 items-center justify-center"
                  >
                    <Text className="text-muted-foreground">{showVeryfi ? '🙈' : '👁️'}</Text>
                  </TouchableOpacity>
                </View>
                
                <View className="space-y-3">
                  <View className="bg-card/60 rounded-xl border border-border/50">
                    <TextInput
                      className="w-full p-4 text-foreground"
                      placeholder="Client ID"
                      placeholderTextColor="#94a3b8"
                      value={keys.veryfi.clientId}
                      onChangeText={(text) => setKeys(prev => ({ ...prev, veryfi: { ...prev.veryfi, clientId: text } }))}
                      secureTextEntry={!showVeryfi}
                    />
                  </View>
                  <View className="bg-card/60 rounded-xl border border-border/50">
                    <TextInput
                      className="w-full p-4 text-foreground"
                      placeholder="Username"
                      placeholderTextColor="#94a3b8"
                      value={keys.veryfi.username}
                      onChangeText={(text) => setKeys(prev => ({ ...prev, veryfi: { ...prev.veryfi, username: text } }))}
                      secureTextEntry={!showVeryfi}
                    />
                  </View>
                  <View className="bg-card/60 rounded-xl border border-border/50">
                    <TextInput
                      className="w-full p-4 text-foreground"
                      placeholder="API Key"
                      placeholderTextColor="#94a3b8"
                      value={keys.veryfi.apiKey}
                      onChangeText={(text) => setKeys(prev => ({ ...prev, veryfi: { ...prev.veryfi, apiKey: text } }))}
                      secureTextEntry={!showVeryfi}
                    />
                  </View>
                </View>
                <Text className="text-xs text-muted-foreground mt-2">
                  Get credentials from veryfi.com for medicine scanning
                </Text>
              </LinearGradient>
            </BlurView>
          </View>

          <View className="space-y-4">
            <TouchableOpacity
              className={`w-full py-4 px-6 rounded-2xl ${
                keys.openai.trim() ? 'bg-primary' : 'bg-muted'
              }`}
              onPress={handleContinue}
              disabled={!keys.openai.trim()}
            >
              <Text className={`text-center text-lg font-semibold ${
                keys.openai.trim() ? 'text-primary-foreground' : 'text-muted-foreground'
              }`}>
                Continue
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSkip}
              className="w-full py-3"
            >
              <Text className="text-center text-muted-foreground text-sm">
                Skip for now (demo mode)
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
