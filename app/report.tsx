import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '@/src/contexts/AppContext';
import { BottomNav } from '@/src/components/BottomNav';

// Toy data for demonstration
const adherenceData = {
  thisWeek: 85,
  lastWeek: 92,
  thisMonth: 88,
  streak: 12
};

const familyHistory = [
  { condition: 'Diabetes Type 2', relation: 'Father', age: 'Diagnosed at 55' },
  { condition: 'Hypertension', relation: 'Mother', age: 'Diagnosed at 48' },
  { condition: 'Heart Disease', relation: 'Grandfather (Paternal)', age: 'Diagnosed at 62' }
];

export default function ReportScreen() {
  const router = useRouter();
  const { state, updateBloodPressure, updateCholesterol, addAllergy, removeAllergy } = useApp();
  const medications = state.medications || [];
  
  const [showBPForm, setShowBPForm] = useState(false);
  const [showCholesterolForm, setShowCholesterolForm] = useState(false);
  const [showAllergyForm, setShowAllergyForm] = useState(false);
  const [bpSystolic, setBpSystolic] = useState('');
  const [bpDiastolic, setBpDiastolic] = useState('');
  const [cholTotal, setCholTotal] = useState('');
  const [cholLDL, setCholLDL] = useState('');
  const [cholHDL, setCholHDL] = useState('');
  const [allergen, setAllergen] = useState('');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Mild');
  const [reaction, setReaction] = useState('');
  
  const handleAddBP = () => {
    if (!bpSystolic || !bpDiastolic) {
      Alert.alert('Error', 'Please enter both systolic and diastolic values');
      return;
    }
    updateBloodPressure({
      systolic: parseInt(bpSystolic),
      diastolic: parseInt(bpDiastolic)
    });
    Alert.alert('Success', 'Blood pressure reading added!');
    setBpSystolic('');
    setBpDiastolic('');
    setShowBPForm(false);
  };
  
  const handleAddCholesterol = () => {
    if (!cholTotal || !cholLDL || !cholHDL) {
      Alert.alert('Error', 'Please enter all cholesterol values');
      return;
    }
    updateCholesterol({
      total: parseInt(cholTotal),
      ldl: parseInt(cholLDL),
      hdl: parseInt(cholHDL)
    });
    Alert.alert('Success', 'Cholesterol reading added!');
    setCholTotal('');
    setCholLDL('');
    setCholHDL('');
    setShowCholesterolForm(false);
  };
  
  const handleAddAllergy = () => {
    if (!allergen || !reaction) {
      Alert.alert('Error', 'Please enter allergen and reaction');
      return;
    }
    addAllergy({ allergen, severity, reaction });
    Alert.alert('Success', 'Allergy added!');
    setAllergen('');
    setReaction('');
    setSeverity('Mild');
    setShowAllergyForm(false);
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
            <View className="flex-row items-center justify-between mb-8">
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-primary text-lg">← Back</Text>
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-foreground">Reports</Text>
              <View className="w-12" />
            </View>

            {/* Medication Summary */}
            <View className="bg-card rounded-2xl p-6 mb-6 border border-border">
              <Text className="text-xl font-semibold text-foreground mb-4">💊 Medication Summary</Text>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-muted-foreground">Total Active Medications</Text>
                <Text className="text-2xl font-bold text-primary">{medications.length}</Text>
              </View>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-muted-foreground">Taken Today</Text>
                <Text className="text-lg font-semibold text-green-500">
                  {medications.filter(m => m.taken).length}/{medications.length}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-muted-foreground">Current Streak</Text>
                <Text className="text-lg font-semibold text-orange-500">{state.streak} days</Text>
              </View>
            </View>

            {/* Adherence Report */}
            <View className="bg-card rounded-2xl p-6 mb-6 border border-border">
              <Text className="text-xl font-semibold text-foreground mb-4">📈 Adherence Report</Text>
              <View className="space-y-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-muted-foreground">This Week</Text>
                  <View className="flex-row items-center">
                    <View className="w-20 h-2 bg-muted rounded-full mr-3">
                      <View className="h-2 bg-green-500 rounded-full" style={{width: `${adherenceData.thisWeek}%`}} />
                    </View>
                    <Text className="text-foreground font-semibold">{adherenceData.thisWeek}%</Text>
                  </View>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-muted-foreground">Last Week</Text>
                  <View className="flex-row items-center">
                    <View className="w-20 h-2 bg-muted rounded-full mr-3">
                      <View className="h-2 bg-blue-500 rounded-full" style={{width: `${adherenceData.lastWeek}%`}} />
                    </View>
                    <Text className="text-foreground font-semibold">{adherenceData.lastWeek}%</Text>
                  </View>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-muted-foreground">This Month</Text>
                  <View className="flex-row items-center">
                    <View className="w-20 h-2 bg-muted rounded-full mr-3">
                      <View className="h-2 bg-purple-500 rounded-full" style={{width: `${adherenceData.thisMonth}%`}} />
                    </View>
                    <Text className="text-foreground font-semibold">{adherenceData.thisMonth}%</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Medical History */}
            <View className="bg-card rounded-2xl p-6 mb-6 border border-border">
              <Text className="text-xl font-semibold text-foreground mb-4">🩺 Medical History</Text>
              
              {/* Blood Pressure */}
              <View className="mb-4 p-4 bg-muted/30 rounded-xl">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-foreground font-medium">Blood Pressure</Text>
                  <TouchableOpacity 
                    onPress={() => setShowBPForm(!showBPForm)}
                    className="bg-primary px-3 py-1 rounded-full"
                  >
                    <Text className="text-primary-foreground text-sm font-medium">
                      {showBPForm ? 'Cancel' : '+ Add'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {showBPForm ? (
                  <View className="space-y-3">
                    <View className="flex-row gap-3">
                      <View className="flex-1">
                        <Text className="text-muted-foreground text-sm mb-1">Systolic</Text>
                        <TextInput
                          className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                          placeholder="120"
                          value={bpSystolic}
                          onChangeText={setBpSystolic}
                          keyboardType="numeric"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-muted-foreground text-sm mb-1">Diastolic</Text>
                        <TextInput
                          className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                          placeholder="80"
                          value={bpDiastolic}
                          onChangeText={setBpDiastolic}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                    <TouchableOpacity 
                      onPress={handleAddBP}
                      className="bg-green-500 py-2 rounded-lg"
                    >
                      <Text className="text-white text-center font-medium">Save Reading</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-muted-foreground">Latest Reading</Text>
                      <Text className="text-foreground font-semibold">
                        {state.medicalHistory.bloodPressure.systolic}/{state.medicalHistory.bloodPressure.diastolic} mmHg
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-muted-foreground">Status</Text>
                      <Text className={`font-medium ${
                        state.medicalHistory.bloodPressure.status === 'High' ? 'text-red-500' :
                        state.medicalHistory.bloodPressure.status === 'Low' ? 'text-yellow-500' : 'text-green-500'
                      }`}>{state.medicalHistory.bloodPressure.status}</Text>
                    </View>
                    <Text className="text-muted-foreground text-sm">Last checked: {state.medicalHistory.bloodPressure.date}</Text>
                  </>
                )}
              </View>

              {/* Cholesterol */}
              <View className="mb-4 p-4 bg-muted/30 rounded-xl">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-foreground font-medium">Cholesterol</Text>
                  <TouchableOpacity 
                    onPress={() => setShowCholesterolForm(!showCholesterolForm)}
                    className="bg-primary px-3 py-1 rounded-full"
                  >
                    <Text className="text-primary-foreground text-sm font-medium">
                      {showCholesterolForm ? 'Cancel' : '+ Add'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {showCholesterolForm ? (
                  <View className="space-y-3">
                    <View className="flex-row gap-2">
                      <View className="flex-1">
                        <Text className="text-muted-foreground text-sm mb-1">Total</Text>
                        <TextInput
                          className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                          placeholder="200"
                          value={cholTotal}
                          onChangeText={setCholTotal}
                          keyboardType="numeric"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-muted-foreground text-sm mb-1">LDL</Text>
                        <TextInput
                          className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                          placeholder="100"
                          value={cholLDL}
                          onChangeText={setCholLDL}
                          keyboardType="numeric"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-muted-foreground text-sm mb-1">HDL</Text>
                        <TextInput
                          className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                          placeholder="50"
                          value={cholHDL}
                          onChangeText={setCholHDL}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                    <TouchableOpacity 
                      onPress={handleAddCholesterol}
                      className="bg-green-500 py-2 rounded-lg"
                    >
                      <Text className="text-white text-center font-medium">Save Reading</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-muted-foreground">Total</Text>
                      <Text className="text-foreground font-semibold">{state.medicalHistory.cholesterol.total} mg/dL</Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-muted-foreground">LDL</Text>
                      <Text className="text-foreground font-semibold">{state.medicalHistory.cholesterol.ldl} mg/dL</Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-muted-foreground">HDL</Text>
                      <Text className="text-foreground font-semibold">{state.medicalHistory.cholesterol.hdl} mg/dL</Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-muted-foreground">Status</Text>
                      <Text className={`font-medium ${
                        state.medicalHistory.cholesterol.status === 'High' ? 'text-red-500' :
                        state.medicalHistory.cholesterol.status === 'Borderline' ? 'text-yellow-500' : 'text-green-500'
                      }`}>{state.medicalHistory.cholesterol.status}</Text>
                    </View>
                    <Text className="text-muted-foreground text-sm">Last checked: {state.medicalHistory.cholesterol.date}</Text>
                  </>
                )}
              </View>

              {/* Thyroid */}
              <View className="mb-4 p-4 bg-muted/30 rounded-xl">
                <Text className="text-foreground font-medium mb-2">Thyroid</Text>
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-muted-foreground">Condition</Text>
                  <Text className="text-foreground font-semibold">Hypothyroidism</Text>
                </View>
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-muted-foreground">Duration</Text>
                  <Text className="text-foreground font-semibold">5 years</Text>
                </View>
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-muted-foreground">Status</Text>
                  <Text className="text-green-500 font-medium">Controlled</Text>
                </View>
                <Text className="text-muted-foreground text-sm">Diagnosed: 2019</Text>
              </View>

              {/* Current Medications */}
              <View className="p-4 bg-muted/30 rounded-xl">
                <Text className="text-foreground font-medium mb-2">Current Medications</Text>
                {medications.length === 0 ? (
                  <Text className="text-muted-foreground">No medications added</Text>
                ) : (
                  medications.map((med, index) => (
                    <View key={index} className="flex-row justify-between items-center py-1">
                      <Text className="text-foreground">{med.name}</Text>
                      <Text className="text-muted-foreground text-sm">{med.dosage}</Text>
                    </View>
                  ))
                )}
              </View>
            </View>

            {/* Family Medical History */}
            <View className="bg-card rounded-2xl p-6 mb-6 border border-border">
              <Text className="text-xl font-semibold text-foreground mb-4">👨‍👩‍👧‍👦 Family Medical History</Text>
              {familyHistory.map((item, index) => (
                <View key={index} className="mb-4 p-4 bg-muted/30 rounded-xl">
                  <Text className="text-foreground font-medium mb-1">{item.condition}</Text>
                  <Text className="text-muted-foreground mb-1">{item.relation}</Text>
                  <Text className="text-muted-foreground text-sm">{item.age}</Text>
                </View>
              ))}
            </View>

            {/* Allergies */}
            <View className="bg-card rounded-2xl p-6 mb-6 border border-border">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-semibold text-foreground">⚠️ Allergies & Reactions</Text>
                <TouchableOpacity 
                  onPress={() => setShowAllergyForm(!showAllergyForm)}
                  className="bg-primary px-3 py-1 rounded-full"
                >
                  <Text className="text-primary-foreground text-sm font-medium">
                    {showAllergyForm ? 'Cancel' : '+ Add'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {showAllergyForm && (
                <View className="mb-4 p-4 bg-muted/30 rounded-xl">
                  <View className="space-y-3">
                    <View>
                      <Text className="text-muted-foreground text-sm mb-1">Allergen</Text>
                      <TextInput
                        className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                        placeholder="e.g., Peanuts"
                        value={allergen}
                        onChangeText={setAllergen}
                      />
                    </View>
                    <View>
                      <Text className="text-muted-foreground text-sm mb-1">Severity</Text>
                      <View className="flex-row gap-2">
                        {(['Mild', 'Moderate', 'Severe'] as const).map((sev) => (
                          <TouchableOpacity
                            key={sev}
                            onPress={() => setSeverity(sev)}
                            className={`px-3 py-2 rounded-lg border ${
                              severity === sev ? 'bg-primary border-primary' : 'border-border'
                            }`}
                          >
                            <Text className={`text-sm ${
                              severity === sev ? 'text-primary-foreground' : 'text-foreground'
                            }`}>{sev}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                    <View>
                      <Text className="text-muted-foreground text-sm mb-1">Reaction</Text>
                      <TextInput
                        className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                        placeholder="e.g., Hives, swelling"
                        value={reaction}
                        onChangeText={setReaction}
                        multiline
                      />
                    </View>
                    <TouchableOpacity 
                      onPress={handleAddAllergy}
                      className="bg-green-500 py-2 rounded-lg"
                    >
                      <Text className="text-white text-center font-medium">Add Allergy</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              
              {state.allergies.map((allergy) => (
                <View key={allergy.id} className="mb-4 p-4 bg-muted/30 rounded-xl">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-foreground font-medium">{allergy.allergen}</Text>
                    <View className="flex-row items-center gap-2">
                      <View className={`px-3 py-1 rounded-full ${
                        allergy.severity === 'Severe' ? 'bg-red-500/20' :
                        allergy.severity === 'Moderate' ? 'bg-yellow-500/20' : 'bg-green-500/20'
                      }`}>
                        <Text className={`text-sm font-medium ${
                          allergy.severity === 'Severe' ? 'text-red-400' :
                          allergy.severity === 'Moderate' ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {allergy.severity}
                        </Text>
                      </View>
                      <TouchableOpacity 
                        onPress={() => removeAllergy(allergy.id)}
                        className="bg-red-500/20 px-2 py-1 rounded-full"
                      >
                        <Text className="text-red-400 text-xs">✕</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text className="text-muted-foreground text-sm">{allergy.reaction}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <BottomNav />
    </View>
  );
}
