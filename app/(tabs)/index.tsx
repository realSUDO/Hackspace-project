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
        // TODO: Add report screen
        break;
      default:
        break;
    }
  };

  return <Dashboard onNavigate={handleNavigate} />;
}
