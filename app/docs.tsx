import React from 'react';
import { DocumentsViewer } from '../src/components/DocumentsViewer';
import { useRouter } from 'expo-router';

export default function DocsScreen() {
  const router = useRouter();

  const handleNavigate = (screen: string) => {
    if (screen === 'dashboard') {
      router.push('/(tabs)');
    } else if (screen === 'document-scan') {
      router.push('/document-scan');
    }
  };

  return <DocumentsViewer onNavigate={handleNavigate} />;
}
