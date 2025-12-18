import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useApp } from '../contexts/AppContext';

interface AddMedicationScreenProps {
  onNavigate: (screen: string) => void;
  prefilledData?: {
    name: string;
    dosage: string;
    time: string;
    frequency: string;
  };
}

export function AddMedicationScreen({ onNavigate, prefilledData }: AddMedicationScreenProps) {
  const { addMedication } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    time: '08:00',
    frequency: 'daily',
  });

  useEffect(() => {
    if (prefilledData) {
      setFormData(prefilledData);
    }
  }, [prefilledData]);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter medication name');
      return;
    }
    if (!formData.dosage.trim()) {
      Alert.alert('Error', 'Please enter dosage');
      return;
    }

    addMedication({
      name: formData.name.trim(),
      dosage: formData.dosage.trim(),
      time: formData.time,
      frequency: formData.frequency,
    });

    Alert.alert('Success', 'Medication added successfully!', [
      { text: 'OK', onPress: () => onNavigate('dashboard') }
    ]);
  };

  const frequencies = ['daily', 'twice daily', 'three times daily', 'weekly', 'as needed'];
  const commonTimes = ['06:00', '08:00', '12:00', '18:00', '20:00', '22:00'];

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#1e293b', '#0f172a', '#020617']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 p-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-foreground mb-2">
              Add Medication
            </Text>
            {prefilledData && (
              <Text className="text-green-400 text-sm">
                ✓ Information detected from scan
              </Text>
            )}
          </View>

          {/* Form */}
          <View className="space-y-6">
            {/* Medication Name */}
            <BlurView intensity={40} className="rounded-2xl overflow-hidden border border-border/30">
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.2)']}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              />
              <View className="p-4">
                <Text className="text-foreground font-medium mb-2">Medication Name</Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholder="Enter medication name"
                  placeholderTextColor="#64748b"
                  className="text-foreground text-lg"
                  style={{ color: '#f8fafc' }}
                />
              </View>
            </BlurView>

            {/* Dosage */}
            <BlurView intensity={40} className="rounded-2xl overflow-hidden border border-border/30">
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.2)']}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              />
              <View className="p-4">
                <Text className="text-foreground font-medium mb-2">Dosage</Text>
                <TextInput
                  value={formData.dosage}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, dosage: text }))}
                  placeholder="e.g., 500mg, 1 tablet"
                  placeholderTextColor="#64748b"
                  className="text-foreground text-lg"
                  style={{ color: '#f8fafc' }}
                />
              </View>
            </BlurView>

            {/* Time */}
            <BlurView intensity={40} className="rounded-2xl overflow-hidden border border-border/30">
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.2)']}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              />
              <View className="p-4">
                <Text className="text-foreground font-medium mb-3">Time</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {commonTimes.map((time) => (
                      <TouchableOpacity
                        key={time}
                        onPress={() => setFormData(prev => ({ ...prev, time }))}
                        className={`px-4 py-2 rounded-lg ${
                          formData.time === time ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <Text className={`${
                          formData.time === time ? 'text-primary-foreground' : 'text-muted-foreground'
                        }`}>
                          {time}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </BlurView>

            {/* Frequency */}
            <BlurView intensity={40} className="rounded-2xl overflow-hidden border border-border/30">
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.2)']}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              />
              <View className="p-4">
                <Text className="text-foreground font-medium mb-3">Frequency</Text>
                <View className="space-y-2">
                  {frequencies.map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      onPress={() => setFormData(prev => ({ ...prev, frequency: freq }))}
                      className={`p-3 rounded-lg ${
                        formData.frequency === freq ? 'bg-primary' : 'bg-muted/20'
                      }`}
                    >
                      <Text className={`${
                        formData.frequency === freq ? 'text-primary-foreground' : 'text-foreground'
                      } capitalize`}>
                        {freq}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </BlurView>
          </View>

          {/* Buttons */}
          <View className="flex-row gap-4 mt-8">
            <TouchableOpacity
              onPress={() => onNavigate('dashboard')}
              className="flex-1"
            >
              <BlurView intensity={30} className="rounded-2xl overflow-hidden border border-border/20">
                <LinearGradient
                  colors={['rgba(30, 41, 59, 0.3)', 'rgba(15, 23, 42, 0.1)']}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                />
                <View className="p-4">
                  <Text className="text-foreground font-medium text-center">Cancel</Text>
                </View>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              className="flex-1"
            >
              <LinearGradient
                colors={['#94a3b8', '#64748b']}
                style={{ padding: 16, borderRadius: 16 }}
              >
                <Text className="text-primary-foreground font-medium text-center">
                  Add Medication
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}