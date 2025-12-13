import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const features = [
    { icon: '📊', text: 'Track medications effortlessly' },
    { icon: '🛡️', text: 'Never miss a dose again' },
    { icon: '🤖', text: 'AI-powered health insights' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-between p-6 pb-12">
        {/* Header spacer */}
        <View className="h-12" />
        
        {/* Main content */}
        <View className="flex-1 items-center justify-center">
          {/* Logo */}
          <View className="relative mb-8">
            <View className="w-32 h-32 rounded-3xl bg-primary items-center justify-center shadow-2xl">
              <Text className="text-5xl">🎤</Text>
            </View>
            <View className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary items-center justify-center">
              <Text className="text-lg">❤️</Text>
            </View>
          </View>
          
          {/* Title */}
          <Text className="text-5xl font-bold mb-3 text-foreground text-center">
            Pulse
          </Text>
          <Text className="text-xl text-muted-foreground mb-8 text-center">
            Your AI Medical Assistant
          </Text>
          
          {/* Features */}
          <View className="space-y-4 mb-12 w-full max-w-sm">
            {features.map((feature, index) => (
              <View
                key={index}
                className="flex-row items-center gap-4 p-4 rounded-2xl bg-muted/50 border border-border"
              >
                <View className="w-12 h-12 rounded-xl bg-primary/20 items-center justify-center">
                  <Text className="text-2xl">{feature.icon}</Text>
                </View>
                <Text className="text-foreground font-medium flex-1">
                  {feature.text}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* CTA Button */}
        <View className="w-full max-w-sm mx-auto">
          <TouchableOpacity
            className="w-full bg-primary py-4 px-6 rounded-2xl shadow-lg active:opacity-80"
            onPress={onGetStarted}
          >
            <Text className="text-center text-primary-foreground text-lg font-semibold">
              Get Started
            </Text>
          </TouchableOpacity>
          <Text className="text-center text-muted-foreground text-sm mt-4">
            Your health data stays private and secure
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
