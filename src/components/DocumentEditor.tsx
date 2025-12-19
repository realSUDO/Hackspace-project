import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { DocumentSearchService } from '../services/documentSearch';

interface DocumentEditorProps {
  document: any;
  onSave: () => void;
  onCancel: () => void;
}

export function DocumentEditor({ document, onSave, onCancel }: DocumentEditorProps) {
  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content);
  const [isSaving, setIsSaving] = useState(false);
  const searchService = new DocumentSearchService();

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Title and content cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      const result = await searchService.updateDocument(document.id, title, content);
      if (result.success) {
        Alert.alert('Success', 'Document updated!', [
          { text: 'OK', onPress: onSave }
        ]);
      } else {
        Alert.alert('Error', result.error || 'Failed to update document');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update document');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#1e293b', '#0f172a', '#020617']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <SafeAreaView className="flex-1">
        <View className="flex-1 p-6">
          <View className="mb-6">
            <Text className="text-3xl font-bold text-white text-center mb-2">
              Edit Document
            </Text>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Title Input */}
            <BlurView intensity={40} className="rounded-2xl overflow-hidden border border-gray-600 mb-4">
              <View className="p-4">
                <Text className="text-white font-medium mb-2">Title</Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Document title"
                  placeholderTextColor="#64748b"
                  className="text-white text-lg"
                  style={{ color: '#f8fafc' }}
                />
              </View>
            </BlurView>

            {/* Content Input */}
            <BlurView intensity={40} className="rounded-2xl overflow-hidden border border-gray-600 mb-6">
              <View className="p-4">
                <Text className="text-white font-medium mb-2">Content</Text>
                <TextInput
                  value={content}
                  onChangeText={setContent}
                  placeholder="Document content"
                  placeholderTextColor="#64748b"
                  multiline
                  numberOfLines={10}
                  textAlignVertical="top"
                  className="text-white text-base"
                  style={{ 
                    color: '#f8fafc',
                    minHeight: 200,
                    maxHeight: 300
                  }}
                />
              </View>
            </BlurView>
          </ScrollView>

          {/* Action Buttons */}
          <View className="flex-row space-x-4 mt-4">
            <TouchableOpacity onPress={handleSave} disabled={isSaving} className="flex-1">
              <LinearGradient
                colors={['#22c55e', '#16a34a']}
                className="rounded-2xl p-4"
              >
                <Text className="text-white text-center font-semibold">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onCancel} className="flex-1">
              <LinearGradient
                colors={['#94a3b8', '#64748b']}
                className="rounded-2xl p-4"
              >
                <Text className="text-white text-center font-semibold">
                  Cancel
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
