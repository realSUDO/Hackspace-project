import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useApp } from '../contexts/AppContext';
import { ProgressRing } from './ProgressRing';
import { BottomNav } from './BottomNav';

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { state, toggleMedication } = useApp();
  
  const takenCount = state.medications.filter(m => m.taken).length;
  const totalCount = state.medications.length;
  const progress = totalCount > 0 ? (takenCount / totalCount) * 100 : 0;
  
  const nextMed = state.medications.find(m => !m.taken);

  return (
    <View className="flex-1">
      {/* Background gradient */}
      <LinearGradient
        colors={['#1e293b', '#0f172a', '#020617']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      {/* Background glow effects */}
      <View className="absolute top-1/4 left-1/2 w-96 h-96 rounded-full bg-primary/5 -translate-x-1/2 pointer-events-none" />
      <View className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-secondary/10 pointer-events-none" />

      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="p-6 pb-4">
            <View className="flex-row items-center justify-between mb-2">
              <View>
                <Text className="text-muted-foreground text-sm">Good morning</Text>
                <Text className="text-2xl font-bold text-foreground">Dashboard</Text>
              </View>
              <LinearGradient
                colors={['#94a3b8', '#64748b']}
                style={{ width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text className="text-primary-foreground text-2xl">💊</Text>
              </LinearGradient>
            </View>
          </View>
          
          {/* Progress Section with Real Glass Effect */}
          <View className="px-6 mb-6">
            <BlurView intensity={60} className="rounded-3xl overflow-hidden border border-border/30">
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.6)', 'rgba(15, 23, 42, 0.4)']}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              />
              <View className="p-6">
                <View className="flex-row items-center gap-6">
                  <ProgressRing progress={progress} size={80} />
                  <View className="flex-1">
                    <Text className="text-2xl font-bold text-foreground mb-1">
                      {takenCount}/{totalCount}
                    </Text>
                    <Text className="text-muted-foreground mb-2">
                      Medications taken today
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="text-2xl mr-2">🔥</Text>
                      <Text className="text-foreground font-medium">
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

          {/* Quick Actions with Glass Effect */}
          <View className="px-6 mb-6">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Quick Actions
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {[
                { icon: '➕', label: 'Add Med', action: () => onNavigate('add') },
                { icon: '🎤', label: 'AI Assistant', action: () => onNavigate('assistant') },
                { icon: '📊', label: 'Reports', action: () => onNavigate('report') },
                { icon: '📷', label: 'Scan', action: () => {} },
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-1 min-w-[45%]"
                  onPress={item.action}
                >
                  <BlurView intensity={30} className="rounded-2xl overflow-hidden border border-border/20">
                    <LinearGradient
                      colors={['rgba(30, 41, 59, 0.3)', 'rgba(15, 23, 42, 0.1)']}
                      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                    />
                    <View className="p-4">
                      <Text className="text-2xl mb-2">{item.icon}</Text>
                      <Text className="text-foreground font-medium">{item.label}</Text>
                    </View>
                  </BlurView>
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
