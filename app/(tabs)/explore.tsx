import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useApp } from '@/src/contexts/AppContext';
import { BottomNav } from '@/src/components/BottomNav';

export default function AddMedicationScreen() {
  const { addMedication } = useApp();
  const params = useLocalSearchParams();
  const [medication, setMedication] = useState({
    name: '',
    dosage: '',
    time: '08:00',
    frequency: 'daily',
  });

  useEffect(() => {
    if (params.prefilled) {
      try {
        const prefilledData = JSON.parse(params.prefilled as string);
        setMedication(prefilledData);
      } catch (error) {
        console.error('Error parsing prefilled data:', error);
      }
    }
  }, [params.prefilled]);

  const handleSave = () => {
    if (!medication.name || !medication.dosage || !medication.time) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }

    addMedication(medication);
    Alert.alert('Success', 'Medication added successfully');
    setMedication({ name: '', dosage: '', time: '', frequency: 'daily' });
  };

  return (
    <View className="flex-1 bg-gray-100">
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="bg-white px-6 py-8 shadow-sm mb-6">
            <Text className="text-3xl font-bold text-gray-900 mb-2">Add Medication</Text>
            <Text className="text-gray-500 text-base">
              {params.prefilled ? 'Information detected from scan' : 'Add a new medication to your schedule'}
            </Text>
            {params.prefilled && (
              <Text className="text-green-600 text-sm mt-2 font-medium">
                ✓ Scanned data loaded
              </Text>
            )}
          </View>

          {/* Form */}
          <View className="px-4">
            <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-900 mb-3">Medication Name *</Text>
                <TextInput
                  className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-base"
                  placeholder="e.g., Aspirin"
                  placeholderTextColor="#9ca3af"
                  value={medication.name}
                  onChangeText={(text) => setMedication(prev => ({ ...prev, name: text }))}
                  accessible={true}
                  accessibilityLabel="Medication name"
                  accessibilityHint="Enter the name of your medication"
                />
              </View>

              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-900 mb-3">Dosage *</Text>
                <TextInput
                  className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-base"
                  placeholder="e.g., 500mg"
                  placeholderTextColor="#9ca3af"
                  value={medication.dosage}
                  onChangeText={(text) => setMedication(prev => ({ ...prev, dosage: text }))}
                />
              </View>

              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-900 mb-3">Time *</Text>
                <TextInput
                  className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-base"
                  placeholder="e.g., 08:00"
                  placeholderTextColor="#9ca3af"
                  value={medication.time}
                  onChangeText={(text) => setMedication(prev => ({ ...prev, time: text }))}
                />
              </View>

              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-900 mb-3">Frequency</Text>
                <View className="flex-row flex-wrap gap-3">
                  {['daily', 'weekly', 'as needed'].map((freq, index) => (
                    <TouchableOpacity
                      key={`freq-${index}-${freq}`}
                      className={`px-4 py-3 rounded-xl ${
                        medication.frequency === freq ? 'bg-blue-500' : 'bg-gray-100 border border-gray-200'
                      }`}
                      onPress={() => setMedication(prev => ({ ...prev, frequency: freq }))}
                    >
                      <Text className={`font-medium ${
                        medication.frequency === freq ? 'text-white' : 'text-gray-700'
                      }`}>
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                className={`w-full py-4 px-6 rounded-xl ${
                  medication.name && medication.dosage && medication.time ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                onPress={handleSave}
                disabled={!medication.name || !medication.dosage || !medication.time}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Add medication"
                accessibilityHint="Double tap to save this medication to your schedule"
                accessibilityState={{ disabled: !medication.name || !medication.dosage || !medication.time }}
              >
                <Text className={`text-center text-lg font-semibold ${
                  medication.name && medication.dosage && medication.time ? 'text-white' : 'text-gray-500'
                }`}>
                  Add Medication
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </View>
  );
}
