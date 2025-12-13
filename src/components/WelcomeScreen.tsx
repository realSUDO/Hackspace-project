import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

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
    <View className="flex-1 bg-background">
      {/* Background glow effects */}
      <View className="absolute top-1/4 left-1/2 w-96 h-96 rounded-full bg-primary/5 -translate-x-1/2 pointer-events-none" />
      <View className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-secondary/10 pointer-events-none" />
      
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-between p-6 pb-12">
          <View className="h-12" />
          
          <View className="flex-1 items-center justify-center">
            <BlurView intensity={20} className="w-full max-w-sm rounded-3xl overflow-hidden mb-8">
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                className="p-8 items-center"
              >
                <View className="w-24 h-24 bg-primary/20 rounded-3xl items-center justify-center mb-6 shadow-lg">
                  <Text className="text-4xl">🎤</Text>
                </View>
                
                <Text className="text-4xl font-bold mb-3 text-foreground text-center">
                  Pulse
                </Text>
                <Text className="text-xl text-muted-foreground mb-6 text-center">
                  Your AI Medical Assistant
                </Text>
              </LinearGradient>
            </BlurView>
            
            <View className="space-y-3 mb-8 w-full max-w-sm">
              {features.map((feature, index) => (
                <BlurView key={index} intensity={15} className="rounded-2xl overflow-hidden">
                  <LinearGradient
                    colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']}
                    className="flex-row items-center gap-4 p-4"
                  >
                    <View className="w-10 h-10 rounded-xl bg-primary/20 items-center justify-center">
                      <Text className="text-lg">{feature.icon}</Text>
                    </View>
                    <Text className="text-foreground font-medium flex-1">
                      {feature.text}
                    </Text>
                  </LinearGradient>
                </BlurView>
              ))}
            </View>
          </View>
          
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
    </View>
  );
}
