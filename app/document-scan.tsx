import React from 'react';
import { useRouter } from 'expo-router';
import { DocumentScanScreen } from '@/src/components/DocumentScanScreen';

export default function DocumentScanRoute() {
  const router = useRouter();

  const handleNavigate = (screen: string) => {
    switch (screen) {
      case 'dashboard':
        router.back();
        break;
      case 'docs':
        router.push('/docs');
        break;
      default:
        break;
    }
  };

  return <DocumentScanScreen onNavigate={handleNavigate} />;
}