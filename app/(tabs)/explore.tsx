import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/src/contexts/AppContext';
import { BottomNav } from '@/src/components/BottomNav';

export default function AddMedicationScreen() {
  const { addMedication } = useApp();
  const [medication, setMedication] = useState({
    name: '',
    dosage: '',
    time: '',
    frequency: 'daily',
  });

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
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="p-6">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-foreground">Add Medication</Text>
            <Text className="text-muted-foreground">Add a new medication to your schedule</Text>
          </View>

          {/* Form */}
          <View className="flex-1">
            <View className="mb-6">
              <Text className="text-lg font-medium text-foreground mb-3">Medication Name *</Text>
              <TextInput
                className="w-full p-4 border border-border rounded-xl bg-muted/50 text-foreground"
                placeholder="e.g., Aspirin"
                placeholderTextColor="#9ca3af"
                value={medication.name}
                onChangeText={(text) => setMedication(prev => ({ ...prev, name: text }))}
              />
            </View>

            <View className="mb-6">
              <Text className="text-lg font-medium text-foreground mb-3">Dosage *</Text>
              <TextInput
                className="w-full p-4 border border-border rounded-xl bg-muted/50 text-foreground"
                placeholder="e.g., 500mg"
                placeholderTextColor="#9ca3af"
                value={medication.dosage}
                onChangeText={(text) => setMedication(prev => ({ ...prev, dosage: text }))}
              />
            </View>

            <View className="mb-6">
              <Text className="text-lg font-medium text-foreground mb-3">Time *</Text>
              <TextInput
                className="w-full p-4 border border-border rounded-xl bg-muted/50 text-foreground"
                placeholder="e.g., 08:00"
                placeholderTextColor="#9ca3af"
                value={medication.time}
                onChangeText={(text) => setMedication(prev => ({ ...prev, time: text }))}
              />
            </View>

            <View className="mb-8">
              <Text className="text-lg font-medium text-foreground mb-3">Frequency</Text>
              <View className="flex-row flex-wrap gap-3">
                {['daily', 'weekly', 'as needed'].map((freq, index) => (
                  <TouchableOpacity
                    key={`freq-${index}-${freq}`}
                    className={`px-4 py-2 rounded-xl ${
                      medication.frequency === freq ? 'bg-primary' : 'bg-muted/50 border border-border'
                    }`}
                    onPress={() => setMedication(prev => ({ ...prev, frequency: freq }))}
                  >
                    <Text className={`font-medium ${
                      medication.frequency === freq ? 'text-primary-foreground' : 'text-foreground'
                    }`}>
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              className={`w-full py-4 px-6 rounded-2xl ${
                medication.name && medication.dosage && medication.time ? 'bg-primary' : 'bg-muted'
              }`}
              onPress={handleSave}
              disabled={!medication.name || !medication.dosage || !medication.time}
            >
              <Text className={`text-center text-lg font-semibold ${
                medication.name && medication.dosage && medication.time ? 'text-primary-foreground' : 'text-muted-foreground'
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
