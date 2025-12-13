import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '@/src/contexts/AppContext';
import { BottomNav } from '@/src/components/BottomNav';

export default function ReportScreen() {
  const router = useRouter();
  const { medications = [] } = useApp();

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="p-6">
            <View className="flex-row items-center justify-between mb-8">
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-primary text-lg">← Back</Text>
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-foreground">Reports</Text>
              <View className="w-12" />
            </View>

            <View className="bg-card rounded-2xl p-6 mb-6 border border-border">
              <Text className="text-xl font-semibold text-foreground mb-4">Medication Summary</Text>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-muted-foreground">Total Medications</Text>
                <Text className="text-2xl font-bold text-primary">{medications.length}</Text>
              </View>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-muted-foreground">Daily Medications</Text>
                <Text className="text-lg font-semibold text-foreground">
                  {medications.filter(m => m?.frequency === 'daily').length}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-muted-foreground">Weekly Medications</Text>
                <Text className="text-lg font-semibold text-foreground">
                  {medications.filter(m => m?.frequency === 'weekly').length}
                </Text>
              </View>
            </View>

            <View className="bg-card rounded-2xl p-6 border border-border">
              <Text className="text-xl font-semibold text-foreground mb-4">Recent Medications</Text>
              {medications.length === 0 ? (
                <Text className="text-muted-foreground text-center py-8">No medications added yet</Text>
              ) : (
                medications.map((med, index) => (
                  <View key={`med-${index}`} className="flex-row justify-between items-center py-3 border-b border-border last:border-b-0">
                    <View>
                      <Text className="text-foreground font-medium">{med?.name || 'Unknown'}</Text>
                      <Text className="text-muted-foreground text-sm">{med?.dosage || ''} • {med?.time || ''}</Text>
                    </View>
                    <View className="bg-primary/10 px-3 py-1 rounded-full">
                      <Text className="text-primary text-sm font-medium">{med?.frequency || 'daily'}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <BottomNav />
    </View>
  );
}
