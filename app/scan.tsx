import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScanScreen } from '@/src/components/ScanScreen';

export default function ScanRoute() {
  const router = useRouter();

  const handleNavigate = (screen: string, data?: any) => {
    switch (screen) {
      case 'dashboard':
        router.back();
        break;
      case 'add':
        router.push({
          pathname: '/(tabs)/explore',
          params: data ? { prefilled: JSON.stringify(data.prefilled) } : {}
        });
        break;
      default:
        break;
    }
  };

  return <ScanScreen onNavigate={handleNavigate} />;
}