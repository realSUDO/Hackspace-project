import React from 'react';
import { useRouter } from 'expo-router';
import { Dashboard } from '@/src/components/Dashboard';

export default function HomeScreen() {
  const router = useRouter();

  const handleNavigate = (screen: string) => {
    switch (screen) {
      case 'add':
        router.push('/(tabs)/explore');
        break;
      case 'assistant':
        router.push('/modal');
        break;
      case 'report':
        router.push('/report');
        break;
      case 'scan':
        router.push('/scan');
        break;
      case 'docs':
        router.push('/docs');
        break;
      default:
        break;
    }
  };

  return <Dashboard onNavigate={handleNavigate} />;
}
