import React from 'react';
import { View, Text, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../services/supabase';

interface DocumentViewerProps {
  onNavigate: (screen: string) => void;
  fileUrl?: string;
  title?: string;
}

export function DocumentViewer({ onNavigate, fileUrl, title }: DocumentViewerProps) {
  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from('documents').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleViewFile = () => {
    if (fileUrl) {
      const publicUrl = getPublicUrl(fileUrl);
      // For now, just show the URL - you can implement proper PDF/image viewer later
      Alert.alert('File URL', publicUrl, [
        { text: 'Copy URL', onPress: () => console.log('URL:', publicUrl) },
        { text: 'OK' }
      ]);
    }
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#1e293b', '#0f172a', '#020617']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      <SafeAreaView className="flex-1 px-6">
        <Text className="text-white text-2xl font-bold mb-6">{title || 'Document Viewer'}</Text>
        
        <ScrollView className="flex-1">
          {fileUrl ? (
            <View className="bg-gray-800 rounded-lg p-4">
              <Text className="text-white mb-4">File stored at: {fileUrl}</Text>
              
              {fileUrl.endsWith('.pdf') ? (
                <View className="bg-red-100 p-4 rounded">
                  <Text className="text-red-800">📄 PDF File</Text>
                  <Text className="text-red-600 mt-2">PDF viewer coming soon!</Text>
                </View>
              ) : (
                <View className="bg-blue-100 p-4 rounded">
                  <Text className="text-blue-800">🖼️ Image File</Text>
                  <Image 
                    source={{ uri: getPublicUrl(fileUrl) }}
                    style={{ width: '100%', height: 300, marginTop: 10 }}
                    resizeMode="contain"
                  />
                </View>
              )}
              
              <Text 
                className="text-blue-400 mt-4 underline"
                onPress={handleViewFile}
              >
                View Full File
              </Text>
            </View>
          ) : (
            <Text className="text-gray-400">No file available for this document.</Text>
          )}
        </ScrollView>
        
        <Text 
          className="text-blue-400 text-center mt-4 underline"
          onPress={() => onNavigate('docs')}
        >
          ← Back to Documents
        </Text>
      </SafeAreaView>
    </View>
  );
}
