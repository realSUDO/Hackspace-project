import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useApp } from '../contexts/AppContext';
import { ProgressRing } from './ProgressRing';
import { BottomNav } from './BottomNav';
import { supabase } from '../services/supabase';

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { state, toggleMedication } = useApp();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const takenCount = state.medications.filter(m => m.taken).length;
  const totalCount = state.medications.length;
  const progress = totalCount > 0 ? (takenCount / totalCount) * 100 : 0;
  
  const nextMed = state.medications.find(m => !m.taken);

  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="bg-white px-6 py-6 shadow-sm mb-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-gray-500 text-sm">Good morning</Text>
                <Text className="text-2xl font-bold text-gray-900">Dashboard</Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <TouchableOpacity onPress={handleSignOut}>
                  <Text className="text-red-500 text-sm font-medium">Sign Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {/* Progress Section */}
          <View className="px-4 mb-6">
            <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <View className="flex-row items-center gap-8">
                <ProgressRing progress={progress} size={160} strokeWidth={12} />
                <View className="flex-1 ml-4 justify-center">
                  <Text className="text-4xl font-bold text-gray-900 mb-2">
                    {takenCount}/{totalCount}
                  </Text>
                  <Text className="text-gray-500 mb-3 text-xl">
                    Medications taken today
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-4xl mr-3">🔥</Text>
                    <Text className="text-gray-900 font-medium text-xl">
                      {state.streak} day streak
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Next Medication */}
          {nextMed && (
            <View className="px-4 mb-6">
              <Text className="text-xl font-semibold text-gray-900 mb-4">
                Next Medication
              </Text>
              <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-400">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-xl font-medium text-gray-900">
                      {nextMed.name}
                    </Text>
                    <Text className="text-lg text-gray-500">
                      {nextMed.dosage} • {nextMed.time}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => toggleMedication(nextMed.id)}>
                    <View className="bg-blue-500 px-4 py-2 rounded-xl">
                      <Text className="text-white font-medium text-lg">
                        Take Now
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Today's Medications */}
          <View className="px-4">
            <Text className="text-xl font-semibold text-gray-900 mb-4">
              Today's Schedule
            </Text>
            <View>
              {state.medications.map((med, index) => (
                <TouchableOpacity key={med.id} onPress={() => toggleMedication(med.id)}>
                  <View 
                    className={`bg-white border ${
                      med.taken ? 'border-green-500' : 'border-gray-400'
                    } shadow-sm`} 
                    style={{ 
                      borderRadius: 16,
                      marginBottom: index < state.medications.length - 1 ? 10 : 0
                    }}
                  >
                    <View className="p-4">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className={`text-xl font-medium ${
                            med.taken ? 'text-green-600' : 'text-gray-900'
                          }`}>
                            {med.name}
                          </Text>
                          <Text className={`text-lg ${
                            med.taken ? 'text-green-500' : 'text-gray-500'
                          }`}>
                            {med.dosage} • {med.time}
                          </Text>
                        </View>
                        <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                          med.taken 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-200'
                        }`}>
                          {med.taken && (
                            <Text className="text-white text-xs">✓</Text>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </View>
  );
}
