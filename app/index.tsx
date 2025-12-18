import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { WelcomeScreen } from '@/src/components/WelcomeScreen';
import { ApiSetupScreen } from '@/src/components/ApiSetupScreen';
import { useApp } from '@/src/contexts/AppContext';

type OnboardingStep = 'welcome' | 'api-setup';

export default function Index() {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const { setApiKeys, setOnboarded, state } = useApp();
  const router = useRouter();

  // If already onboarded, go to dashboard
  React.useEffect(() => {
    if (state.isOnboarded) {
      router.replace('/(tabs)');
    }
  }, [state.isOnboarded]);

  const handleGetStarted = () => {
    setStep('api-setup');
  };

  const handleApiComplete = (keys: { openai: string; elevenlabs: string; veryfi?: { clientId: string; username: string; apiKey: string } }) => {
    setApiKeys(keys);
    setOnboarded(true);
    router.replace('/(tabs)');
  };

  if (step === 'api-setup') {
    return (
      <ApiSetupScreen 
        onBack={() => setStep('welcome')} 
        onComplete={handleApiComplete} 
      />
    );
  }

  return <WelcomeScreen onGetStarted={handleGetStarted} />;
}
