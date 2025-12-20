import React from 'react';
import { DocumentsViewer } from '../src/components/DocumentsViewer';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function DocsScreen() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = React.useState(0);

  // Refresh documents each time screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  const handleNavigate = (screen: string) => {
    if (screen === 'dashboard') {
      router.push('/(tabs)');
    } else if (screen === 'document-scan') {
      router.push('/document-scan');
    }
  };

  return <DocumentsViewer key={refreshKey} onNavigate={handleNavigate} />;
}
