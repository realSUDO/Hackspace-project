import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, TextInput, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { DocumentSearchService } from '../services/documentSearch';
import { supabase } from '../services/supabase';
import * as IntentLauncher from 'expo-intent-launcher';
import { DocumentEditor } from './DocumentEditor';

interface DocumentsViewerProps {
  onNavigate: (screen: string) => void;
}

export function DocumentsViewer({ onNavigate }: DocumentsViewerProps) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDocument, setEditingDocument] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchService = new DocumentSearchService();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    const result = await searchService.getAllDocuments();
    
    if (result.success) {
      setDocuments(result.results || []);
    } else {
      Alert.alert('Error', result.error || 'Failed to load documents');
    }
    setIsLoading(false);
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      loadDocuments(); // Show all documents if search is empty
      return;
    }

    setIsSearching(true);
    const result = await searchService.searchDocuments(searchQuery);
    
    if (result.success) {
      setDocuments(result.results || []);
      if (result.results?.length === 0) {
        Alert.alert('No Results', `No documents found for "${searchQuery}"`);
      }
    } else {
      Alert.alert('Search Error', result.error || 'Failed to search documents');
    }
    setIsSearching(false);
  };

  const showDocument = (doc: any) => {
    Alert.alert(
      doc.title,
      doc.content,
      [{ text: 'OK' }]
    );
  };

  const confirmDelete = (doc: any) => {
    Alert.alert(
      'Delete Document',
      `Are you sure you want to delete "${doc.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteDocument(doc.id) }
      ]
    );
  };

  const viewDocument = (doc: any) => {
    if (doc.file_url) {
      // Get the public URL for the file
      const { data } = supabase.storage.from('documents').getPublicUrl(doc.file_url);
      const publicUrl = data.publicUrl;
      
      Alert.alert(
        'View Document', 
        `${doc.title}\n\nFile Type: ${doc.file_url.endsWith('.pdf') ? 'PDF' : 'Image'}`,
        [
          { 
            text: 'Open File', 
            onPress: async () => {
              try {
                if (Platform.OS === 'android') {
                  // Force Android to show "Open with" chooser
                  await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                    data: publicUrl,
                    flags: 1,
                    type: doc.file_url.endsWith('.pdf') ? 'application/pdf' : 'image/*'
                  });
                } else {
                  await Linking.openURL(publicUrl);
                }
              } catch (error) {
                Alert.alert('Error', 'Could not open file');
              }
            }
          },
          { text: 'Cancel' }
        ]
      );
    } else {
      Alert.alert('File Not Available', 'Original file not stored for this document.');
    }
  };

  const editDocument = (doc: any) => {
    setEditingDocument(doc);
  };

  const handleEditorSave = () => {
    setEditingDocument(null);
    loadDocuments(); // Refresh the list
  };

  const handleEditorCancel = () => {
    setEditingDocument(null);
  };

  const deleteDocument = async (id: string) => {
    try {
      const result = await searchService.deleteDocument(id);
      if (result.success) {
        Alert.alert('Success', 'Document deleted!');
        loadDocuments(); // Refresh the list
      } else {
        Alert.alert('Error', result.error || 'Failed to delete document');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete document');
    }
  };

  // Show editor if editing a document
  if (editingDocument) {
    return (
      <DocumentEditor
        document={editingDocument}
        onSave={handleEditorSave}
        onCancel={handleEditorCancel}
      />
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-8 shadow-sm mb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">My Documents</Text>
          <Text className="text-gray-500 text-base">
            {documents.length} documents saved
          </Text>
        </View>

        <View className="flex-1 px-4">
          {/* Search Bar */}
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
            <View className="flex-row items-center">
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search documents..."
                placeholderTextColor="#9ca3af"
                className="flex-1 text-gray-900 text-base mr-3 p-3 bg-gray-50 rounded-xl border border-gray-200"
              />
              <TouchableOpacity 
                onPress={performSearch} 
                disabled={isSearching}
                className="bg-blue-500 rounded-xl px-4 py-3"
              >
                <Text className="text-white font-semibold">
                  {isSearching ? '🔍' : 'Search'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className="text-gray-500 mt-4">Loading documents...</Text>
            </View>
          ) : documents.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-500 text-center mb-6 text-lg">
                No documents yet.{'\n'}Scan some documents to see them here!
              </Text>
              <TouchableOpacity 
                onPress={() => onNavigate('document-scan')}
                className="bg-blue-500 rounded-2xl px-6 py-4"
              >
                <Text className="text-white font-semibold text-base">Scan Document</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {documents.map((doc, index) => (
                <View key={doc.id} className="mb-4">
                  <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                    <View className="flex-row">
                      <TouchableOpacity onPress={() => showDocument(doc)} className="flex-1">
                        <Text className="text-gray-900 font-semibold text-lg mb-2">
                          {doc.title}
                        </Text>
                        <Text className="text-gray-500 text-sm mb-2">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </Text>
                        <Text className="text-gray-600 text-sm" numberOfLines={3}>
                          {doc.content}
                        </Text>
                      </TouchableOpacity>
                      
                      <View className="ml-3 flex-col space-y-2">
                        <TouchableOpacity
                          onPress={() => viewDocument(doc)}
                          className="justify-center items-center w-10 h-10 rounded-full bg-green-50"
                        >
                          <Text className="text-green-600 text-lg">👁️</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          onPress={() => editDocument(doc)} 
                          className="justify-center items-center w-10 h-10 rounded-full bg-blue-50"
                        >
                          <Text className="text-blue-600 text-lg">✏️</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          onPress={() => confirmDelete(doc)} 
                          className="justify-center items-center w-10 h-10 rounded-full bg-red-50"
                        >
                          <Text className="text-red-600 text-lg">🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          <View className="flex-row space-x-4 mt-6 mb-6">
            <TouchableOpacity 
              onPress={() => onNavigate('document-scan')} 
              className="flex-1 bg-blue-500 rounded-2xl p-4"
            >
              <Text className="text-white text-center font-semibold">
                Scan New Document
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => onNavigate('dashboard')} 
              className="flex-1 bg-gray-400 rounded-2xl p-4"
            >
              <Text className="text-white text-center font-semibold">
                Back to Dashboard
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
