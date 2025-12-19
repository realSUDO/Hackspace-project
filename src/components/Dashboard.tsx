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
                  <View className="bg-red-500 px-4 py-2 rounded-xl">
                    <Text className="text-white text-sm font-medium">Sign Out</Text>
                  </View>
                </TouchableOpacity>
                <View className="bg-blue-100 w-12 h-12 rounded-full items-center justify-center">
                  <Text className="text-2xl">💊</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Progress Section */}
          <View className="px-4 mb-6">
            <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <View className="flex-row items-center gap-6">
                <ProgressRing progress={progress} size={80} />
                <View className="flex-1">
                  <Text className="text-2xl font-bold text-gray-900 mb-1">
                    {takenCount}/{totalCount}
                  </Text>
                  <Text className="text-gray-500 mb-2">
                    Medications taken today
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-2xl mr-2">🔥</Text>
                    <Text className="text-gray-900 font-medium">
                      {state.streak} day streak
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            </BlurView>
          </View>

          {/* Next Medication with Glass Effect */}
          {nextMed && (
            <View className="px-6 mb-6">
              <Text className="text-lg font-semibold text-foreground mb-3">
                Next Medication
              </Text>
              <BlurView intensity={40} className="rounded-2xl overflow-hidden border border-border/30">
                <LinearGradient
                  colors={['rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.2)']}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                />
                <View className="p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-lg font-medium text-foreground">
                        {nextMed.name}
                      </Text>
                      <Text className="text-muted-foreground">
                        {nextMed.dosage} • {nextMed.time}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => toggleMedication(nextMed.id)}>
                      <LinearGradient
                        colors={['#94a3b8', '#64748b']}
                        style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 }}
                      >
                        <Text className="text-primary-foreground font-medium">
                          Take Now
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </BlurView>
            </View>
          )}

          {/* Quick Actions */}
          <View className="px-4 mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {[
                { icon: '➕', label: 'Add Med', action: () => onNavigate('add') },
                { icon: '🎤', label: 'AI Assistant', action: () => onNavigate('assistant') },
                { icon: '📊', label: 'Reports', action: () => onNavigate('report') },
                { icon: '📷', label: 'Scan', action: () => onNavigate('scan') },
                { icon: '📄', label: 'My Documents', action: () => onNavigate('docs') },
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-1 min-w-[45%]"
                  onPress={item.action}
                >
                  <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <Text className="text-2xl mb-2">{item.icon}</Text>
                    <Text className="text-gray-900 font-medium">{item.label}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Today's Medications with Glass Effect */}
          <View className="px-6">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Today's Schedule
            </Text>
            <View className="space-y-3">
              {state.medications.map((med) => (
                <TouchableOpacity key={med.id} onPress={() => toggleMedication(med.id)}>
                  <BlurView intensity={med.taken ? 20 : 40} className="rounded-2xl overflow-hidden border border-border/30">
                    <LinearGradient
                      colors={med.taken 
                        ? ['rgba(34, 197, 94, 0.2)', 'rgba(22, 163, 74, 0.1)']
                        : ['rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.2)']
                      }
                      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                    />
                    <View className="p-4">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className={`text-lg font-medium ${
                            med.taken ? 'text-green-300' : 'text-foreground'
                          }`}>
                            {med.name}
                          </Text>
                          <Text className={`${
                            med.taken ? 'text-green-400' : 'text-muted-foreground'
                          }`}>
                            {med.dosage} • {med.time}
                          </Text>
                        </View>
                        <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                          med.taken 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-muted-foreground'
                        }`}>
                          {med.taken && (
                            <Text className="text-white text-xs">✓</Text>
                          )}
                        </View>
                      </View>
                    </View>
                  </BlurView>
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
