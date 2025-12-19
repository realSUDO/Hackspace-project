import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { DocumentOCRService } from '../services/documentOCR';

interface DocumentScanScreenProps {
  onNavigate: (screen: string) => void;
}

export function DocumentScanScreen({ onNavigate }: DocumentScanScreenProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [title, setTitle] = useState('');
  const documentOCRService = new DocumentOCRService();

  const scanDocument = async () => {
    if (!title.trim()) {
      Alert.alert('Title Required', 'Please enter a document title');
      return;
    }

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required');
        return;
      }

      setIsProcessing(true);

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        await processDocument(imageUri);
      }
    } catch (error) {
      console.error('Error scanning:', error);
      Alert.alert('Error', 'Failed to scan document');
    } finally {
      setIsProcessing(false);
    }
  };

  const uploadDocument = async () => {
    if (!title.trim()) {
      Alert.alert('Title Required', 'Please enter a document title');
      return;
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Photo library permission is required');
        return;
      }

      setIsProcessing(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        await processDocument(imageUri);
      }
    } catch (error) {
      console.error('Error uploading:', error);
      Alert.alert('Error', 'Failed to upload document');
    } finally {
      setIsProcessing(false);
    }
  };

  const processDocument = async (imageUri: string) => {
    console.log('Processing document:', { imageUri, title });
    const result = await documentOCRService.processDocument(imageUri, title);
    console.log('Process result:', result);

    if (result.success) {
      Alert.alert('Success', `Document processed and saved! ID: ${result.documentId}`, [
        { text: 'OK', onPress: () => onNavigate('docs') }
      ]);
      setTitle('');
    } else {
      Alert.alert('Error', result.error || 'Failed to process document');
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
          <View className="mb-8">
            <Text className="text-3xl font-bold text-foreground text-center mb-2">
              Document OCR
            </Text>
            <Text className="text-muted-foreground text-center">
              Scan or upload documents to extract text
            </Text>
          </View>

          {/* Title Input */}
          <BlurView intensity={40} className="rounded-2xl overflow-hidden border border-border/30 mb-6 w-full">
            <LinearGradient
              colors={['rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.2)']}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <View className="p-4">
              <Text className="text-foreground font-medium mb-2">Document Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Enter document title"
                placeholderTextColor="#64748b"
                className="text-foreground text-lg"
                style={{ color: '#f8fafc' }}
              />
            </View>
          </BlurView>

          {/* Action Buttons */}
          <View className="w-full space-y-4 mb-8">
            <TouchableOpacity onPress={scanDocument} disabled={isProcessing}>
              <BlurView intensity={60} className="rounded-3xl overflow-hidden border border-border/30">
                <LinearGradient
                  colors={['rgba(30, 41, 59, 0.6)', 'rgba(15, 23, 42, 0.4)']}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                />
                <View className="p-6 items-center">
                  {isProcessing ? (
                    <ActivityIndicator size="large" color="#94a3b8" />
                  ) : (
                    <Text className="text-4xl mb-2">📷</Text>
                  )}
                  <Text className="text-xl font-semibold text-foreground mb-1">
                    {isProcessing ? 'Processing...' : 'Scan Document'}
                  </Text>
                  <Text className="text-muted-foreground text-center text-sm">
                    Take a photo of your document
                  </Text>
                </View>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity onPress={uploadDocument} disabled={isProcessing}>
              <BlurView intensity={40} className="rounded-2xl overflow-hidden border border-border/30">
                <LinearGradient
                  colors={['rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.2)']}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                />
                <View className="p-4 items-center">
                  <Text className="text-2xl mb-2">📁</Text>
                  <Text className="text-lg font-semibold text-foreground mb-1">
                    Upload from Gallery
                  </Text>
                  <Text className="text-muted-foreground text-center text-sm">
                    Choose from photo library
                  </Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          </View>

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