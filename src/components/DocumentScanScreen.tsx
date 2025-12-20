import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
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
        mediaTypes: 'images',
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
      setIsProcessing(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setIsProcessing(false);
        return;
      }

      const asset = Array.isArray(result.assets) ? result.assets[0] : result;
      const fileUri = asset.uri;
      const fileName = asset.name || 'document';
      
      if (fileName.toLowerCase().endsWith('.pdf')) {
        await processPDF(fileUri);
      } else {
        await processDocument(fileUri);
      }
    } catch (error) {
      console.error('Error uploading:', error);
      Alert.alert('Error', 'Failed to upload document');
    } finally {
      setIsProcessing(false);
    }
  };

  const processPDF = async (pdfUri: string) => {
    try {
      const result = await documentOCRService.processDocument(pdfUri, title, true);
      
      if (result.success) {
        Alert.alert('Success', 'PDF processed and saved successfully!');
        setTitle('');
      } else {
        Alert.alert('Error', result.error || 'No text found - couldn\'t add document. Please try a different file.');
      }
    } catch (error) {
      console.error('PDF processing error:', error);
      Alert.alert('Error', 'No text found - couldn\'t add document.');
    }
  };

  const processDocument = async (imageUri: string) => {
    console.log('Processing document:', { imageUri, title });
    const result = await documentOCRService.processDocument(imageUri, title);
    console.log('Process result:', result);

    if (result.success) {
      let message = `Extracted Text:\n\n${result.extractedText?.substring(0, 200)}${result.extractedText && result.extractedText.length > 200 ? '...' : ''}`;
      
      if (result.documentId) {
        message = `✅ Saved to Database!\nDocument ID: ${result.documentId}\n\n${message}`;
      } else if (result.error) {
        message = `⚠️ ${result.error}\n\n${message}`;
      }
      
      Alert.alert('OCR Success!', message, [{ text: 'OK' }]);
      setTitle('');
    } else {
      Alert.alert('OCR Failed', result.error || 'Failed to extract text');
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-8 shadow-sm mb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Document OCR</Text>
          <Text className="text-gray-500 text-base">
            Scan or upload documents to extract text
          </Text>
        </View>

        <View className="flex-1 px-4">
          {/* Title Input */}
          <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Document Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter document title"
              placeholderTextColor="#9ca3af"
              className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-base"
            />
          </View>

          {/* Action Buttons */}
          <View className="space-y-4 mb-8">
            <TouchableOpacity 
              onPress={scanDocument} 
              disabled={isProcessing}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
            >
              <View className="items-center">
                {isProcessing ? (
                  <ActivityIndicator size="large" color="#3b82f6" />
                ) : (
                  <Text className="text-4xl mb-3">📷</Text>
                )}
                <Text className="text-xl font-semibold text-gray-900 mb-2">
                  {isProcessing ? 'Processing...' : 'Scan Document'}
                </Text>
                <Text className="text-gray-500 text-center">
                  Take a photo of your document
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={uploadDocument} 
              disabled={isProcessing}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
            >
              <View className="items-center">
                <Text className="text-2xl mb-3">📁</Text>
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                  📄 Upload Image/PDF
                </Text>
                <Text className="text-gray-500 text-center">
                  Choose from photo library
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={() => onNavigate('dashboard')}
            className="bg-gray-400 rounded-2xl p-4 mb-6"
          >
            <Text className="text-white font-semibold text-center">
              Back to Dashboard
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}