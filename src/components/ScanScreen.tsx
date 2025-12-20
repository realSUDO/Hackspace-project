import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../contexts/AppContext';
import { MLKitService } from '../services/mlkit';

interface ScanScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  autoScan?: boolean;
}

export function ScanScreen({ onNavigate, autoScan }: ScanScreenProps) {
  const [isScanning, setIsScanning] = useState(false);
  const { state } = useApp();
  
  const ocrService = new MLKitService();

  // Auto-start scanning if autoScan is true
  React.useEffect(() => {
    if (autoScan) {
      scanMedicine();
    }
  }, [autoScan]);

  const scanMedicine = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to scan medicines');
        return;
      }

      setIsScanning(true);

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        await processWithOCR(imageUri);
      }
    } catch (error) {
      console.error('Error scanning:', error);
      Alert.alert('Error', 'Failed to scan medicine. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const processWithOCR = async (imageUri: string) => {
    try {
      const result = await ocrService.processImage(imageUri);
      
      if (result.success && result.medicineName) {
        onNavigate('add', { 
          prefilled: {
            name: result.medicineName,
            dosage: result.dosage || '',
            time: '08:00',
            frequency: 'daily'
          }
        });
      } else {
        Alert.alert('No medicine detected', 'Could not detect medicine name from the image. Please try again or add manually.');
      }
    } catch (error) {
      console.error('OCR error:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    }
  };



  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#1e293b', '#0f172a', '#020617']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center items-center p-6">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-foreground text-center mb-2">
              Scan Medicine
            </Text>
            <Text className="text-muted-foreground text-center">
              Take a photo of your medicine bottle or package
            </Text>
          </View>

          {/* Scan Buttons */}
          <View className="mb-8 space-y-4">
            <TouchableOpacity
              onPress={scanMedicine}
              disabled={isScanning}
            >
            <BlurView intensity={60} className="rounded-3xl overflow-hidden border border-border/30">
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.6)', 'rgba(15, 23, 42, 0.4)']}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              />
              <View className="p-8 items-center">
                {isScanning ? (
                  <ActivityIndicator size="large" color="#94a3b8" />
                ) : (
                  <Text className="text-6xl mb-4">📷</Text>
                )}
                <Text className="text-xl font-semibold text-foreground mb-2">
                  {isScanning ? 'Processing...' : 'Take Photo'}
                </Text>
                <Text className="text-muted-foreground text-center">
                  {isScanning ? 'Processing image...' : 'Point camera at medicine label'}
                </Text>
              </View>
            </BlurView>
            </TouchableOpacity>


          </View>

          {/* Instructions */}
          <BlurView intensity={40} className="rounded-2xl overflow-hidden border border-border/30 mb-8">
            <LinearGradient
              colors={['rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.2)']}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <View className="p-6">
              <Text className="text-lg font-semibold text-foreground mb-3">
                Tips for better scanning:
              </Text>
              <Text className="text-muted-foreground mb-2">• Ensure good lighting</Text>
              <Text className="text-muted-foreground mb-2">• Keep text clear and readable</Text>
              <Text className="text-muted-foreground mb-2">• Focus on medicine name and dosage</Text>
              <Text className="text-muted-foreground">• Hold camera steady</Text>
            </View>
          </BlurView>

          {/* Back Button */}
          <TouchableOpacity onPress={() => onNavigate('dashboard')}>
            <LinearGradient
              colors={['#94a3b8', '#64748b']}
              style={{ paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16 }}
            >
              <Text className="text-primary-foreground font-medium">
                Back to Dashboard
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
