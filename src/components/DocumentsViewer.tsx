import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { DocumentSearchService } from '../services/documentSearch';
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
    <View className="flex-1">
      <LinearGradient
        colors={['#1e293b', '#0f172a', '#020617']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <SafeAreaView className="flex-1">
        <View className="flex-1 p-6">
          <View className="mb-6">
            <Text className="text-3xl font-bold text-white text-center mb-2">
              My Documents
            </Text>
            <Text className="text-gray-400 text-center mb-4">
              {documents.length} documents saved
            </Text>
            
            {/* Search Bar */}
            <BlurView intensity={40} className="rounded-2xl overflow-hidden border border-gray-600">
              <View className="p-4 flex-row items-center">
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search documents..."
                  placeholderTextColor="#64748b"
                  className="flex-1 text-white text-lg mr-3"
                  style={{ color: '#f8fafc' }}
                />
                <TouchableOpacity onPress={performSearch} disabled={isSearching}>
                  <LinearGradient
                    colors={['#3b82f6', '#1d4ed8']}
                    className="rounded-xl px-4 py-2"
                  >
                    <Text className="text-white font-medium">
                      {isSearching ? '🔍' : 'Search'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>

          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className="text-gray-400 mt-4">Loading documents...</Text>
            </View>
          ) : documents.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-400 text-center mb-4">
                No documents yet.{'\n'}Scan some documents to see them here!
              </Text>
              <TouchableOpacity onPress={() => onNavigate('document-scan')}>
                <LinearGradient
                  colors={['#3b82f6', '#1d4ed8']}
                  className="rounded-2xl px-6 py-3"
                >
                  <Text className="text-white font-semibold">Scan Document</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {documents.map((doc, index) => (
                <View key={doc.id} className="mb-4">
                  <BlurView intensity={40} className="rounded-2xl overflow-hidden border border-gray-600">
                    <View className="p-4 flex-row">
                      <TouchableOpacity onPress={() => showDocument(doc)} className="flex-1">
                        <Text className="text-white font-semibold text-lg mb-2">
                          {doc.title}
                        </Text>
                        <Text className="text-gray-400 text-sm mb-2">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </Text>
                        <Text className="text-gray-300 text-sm" numberOfLines={3}>
                          {doc.content}
                        </Text>
                      </TouchableOpacity>
                      
                      <View className="ml-3 flex-col space-y-2">
                        <TouchableOpacity 
                          onPress={() => editDocument(doc)} 
                          className="justify-center items-center w-10 h-10 rounded-full bg-blue-500/20"
                        >
                          <Text className="text-blue-400 text-lg">✏️</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          onPress={() => confirmDelete(doc)} 
                          className="justify-center items-center w-10 h-10 rounded-full bg-red-500/20"
                        >
                          <Text className="text-red-400 text-lg">🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </BlurView>
                </View>
              ))}
            </ScrollView>
          )}

          <View className="flex-row space-x-4 mt-6">
            <TouchableOpacity onPress={() => onNavigate('document-scan')} className="flex-1">
              <LinearGradient
                colors={['#3b82f6', '#1d4ed8']}
                className="rounded-2xl p-4"
              >
                <Text className="text-white text-center font-semibold">
                  Scan New Document
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => onNavigate('dashboard')} className="flex-1">
              <LinearGradient
                colors={['#94a3b8', '#64748b']}
                className="rounded-2xl p-4"
              >
                <Text className="text-white text-center font-semibold">
                  Back to Dashboard
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
