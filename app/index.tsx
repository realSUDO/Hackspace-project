import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { WelcomeScreen } from '@/src/components/WelcomeScreen';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoggedIn, isLoading]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // Fallback - shouldn't normally be seen
  return <WelcomeScreen onGetStarted={() => router.replace('/login')} />;
}
