import React from 'react';
import { useRouter } from 'expo-router';
import { AssistantScreen } from '@/src/components/AssistantScreen';

export default function ModalScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return <AssistantScreen onBack={handleBack} />;
}
