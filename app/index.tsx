import React from 'react';
import { useRouter } from 'expo-router';
import { WelcomeScreen } from '@/src/components/WelcomeScreen';
import { useApp } from '@/src/contexts/AppContext';

export default function Index() {
  const { setOnboarded, state } = useApp();
  const router = useRouter();

  React.useEffect(() => {
    if (state.isOnboarded) {
      router.replace('/(tabs)');
    }
  }, [state.isOnboarded]);

  const handleGetStarted = () => {
    setOnboarded(true);
    router.replace('/(tabs)');
  };

  return <WelcomeScreen onGetStarted={handleGetStarted} />;
}
