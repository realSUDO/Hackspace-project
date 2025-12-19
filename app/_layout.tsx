import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

import { AppProvider } from '@/src/contexts/AppContext';
import { ConnectionProvider } from '@/hooks/useConnection';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { registerGlobals } from '@livekit/react-native';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';

// Register WebRTC globals
registerGlobals();

export const unstable_settings = {
  initialRouteName: 'index',
};

function RootLayoutNav() {
  const { isLoggedIn, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'login';

    if (!isLoggedIn && !inAuthGroup) {
      router.replace('/login');
    } else if (isLoggedIn && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, isLoading, segments]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Settings' }} />
      <Stack.Screen name="report" options={{ headerShown: false }} />
      <Stack.Screen name="docs" options={{ headerShown: false }} />
      <Stack.Screen name="document-scan" options={{ headerShown: false }} />
      <Stack.Screen name="scan" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <AppProvider>
        <ConnectionProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootLayoutNav />
            <StatusBar style="auto" />
          </ThemeProvider>
        </ConnectionProvider>
      </AppProvider>
    </AuthProvider>
  );
}
