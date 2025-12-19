import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';

export default function DocsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#1e293b', '#0f172a', '#020617']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 p-6">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-foreground mb-2">
              Documentation
            </Text>
            <Text className="text-muted-foreground">
              Learn how to use the medication tracker
            </Text>
          </View>

          <BlurView intensity={40} className="rounded-2xl overflow-hidden border border-border/30 mb-6">
            <LinearGradient
              colors={['rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.2)']}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <View className="p-6">
              <Text className="text-xl font-semibold text-foreground mb-4">
                Getting Started
              </Text>
              <Text className="text-muted-foreground mb-3">
                • Add medications using the + button
              </Text>
              <Text className="text-muted-foreground mb-3">
                • Use the scan feature to detect medicine names
              </Text>
              <Text className="text-muted-foreground mb-3">
                • Mark medications as taken from the dashboard
              </Text>
              <Text className="text-muted-foreground">
                • View reports to track your progress
              </Text>
            </View>
          </BlurView>

          <BlurView intensity={40} className="rounded-2xl overflow-hidden border border-border/30 mb-6">
            <LinearGradient
              colors={['rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.2)']}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <View className="p-6">
              <Text className="text-xl font-semibold text-foreground mb-4">
                Features
              </Text>
              <Text className="text-muted-foreground mb-3">
                📷 Scan Feature: Take photos to detect medicine names
              </Text>
              <Text className="text-muted-foreground mb-3">
                🎤 AI Assistant: Voice-powered medication help
              </Text>
              <Text className="text-muted-foreground mb-3">
                📊 Reports: Track your medication adherence
              </Text>
              <Text className="text-muted-foreground">
                🔔 Reminders: Never miss a dose
              </Text>
            </View>
          </BlurView>

          <TouchableOpacity onPress={() => router.push('/document-scan')}>
            <BlurView intensity={60} className="rounded-3xl overflow-hidden border border-border/30">
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.6)', 'rgba(15, 23, 42, 0.4)']}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              />
              <View className="p-6 items-center">
                <Text className="text-4xl mb-3">📄</Text>
                <Text className="text-xl font-semibold text-foreground mb-2">
                  Document OCR
                </Text>
                <Text className="text-muted-foreground text-center">
                  Scan documents and extract text with AI
                </Text>
              </View>
            </BlurView>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}