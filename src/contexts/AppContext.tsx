import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { saveConfig, getConfig, saveSecure, getSecure } from '../services/storage';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  frequency: string;
}

interface AppState {
  isOnboarded: boolean;
  apiKeys: {
    openai: string;
    elevenlabs: string;
    veryfi: {
      clientId: string;
      username: string;
      apiKey: string;
    };
  };
  medications: Medication[];
  streak: number;
}

interface AppContextType {
  state: AppState;
  setOnboarded: (value: boolean) => void;
  setApiKeys: (keys: { openai: string; elevenlabs: string; veryfi?: { clientId: string; username: string; apiKey: string } }) => void;
  addMedication: (med: Omit<Medication, 'id' | 'taken'>) => void;
  toggleMedication: (id: string) => void;
  removeMedication: (id: string) => void;
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialMedications: Medication[] = [
  { id: '1', name: 'Vitamin D', dosage: '1000 IU', time: '08:00', taken: true, frequency: 'daily' },
  { id: '2', name: 'Omega-3', dosage: '1000mg', time: '08:00', taken: true, frequency: 'daily' },
  { id: '3', name: 'Metformin', dosage: '500mg', time: '12:00', taken: true, frequency: 'daily' },
  { id: '4', name: 'Lisinopril', dosage: '10mg', time: '18:00', taken: false, frequency: 'daily' },
  { id: '5', name: 'Aspirin', dosage: '81mg', time: '20:00', taken: false, frequency: 'daily' },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    isOnboarded: false,
    apiKeys: { openai: '', elevenlabs: '', veryfi: { clientId: '', username: '', apiKey: '' } },
    medications: initialMedications,
    streak: 12,
  });

  const loadData = async () => {
    try {
      const onboarded = await getConfig<boolean>('isOnboarded');
      const medications = await getConfig<Medication[]>('medications');
      const streak = await getConfig<number>('streak');
      const openaiKey = await getSecure('openai_key');
      const elevenlabsKey = await getSecure('elevenlabs_key');
      const veryfiClientId = await getSecure('veryfi_client_id');
      const veryfiUsername = await getSecure('veryfi_username');
      const veryfiApiKey = await getSecure('veryfi_api_key');

      setState(prev => ({
        ...prev,
        isOnboarded: onboarded ?? false,
        medications: medications ?? initialMedications,
        streak: streak ?? 12,
        apiKeys: {
          openai: openaiKey ?? '',
          elevenlabs: elevenlabsKey ?? '',
          veryfi: {
            clientId: veryfiClientId ?? '',
            username: veryfiUsername ?? '',
            apiKey: veryfiApiKey ?? ''
          }
        },
      }));
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const saveData = async () => {
    try {
      await saveConfig('isOnboarded', state.isOnboarded);
      await saveConfig('medications', state.medications);
      await saveConfig('streak', state.streak);
      if (state.apiKeys.openai) {
        await saveSecure('openai_key', state.apiKeys.openai);
      }
      if (state.apiKeys.elevenlabs) {
        await saveSecure('elevenlabs_key', state.apiKeys.elevenlabs);
      }
      if (state.apiKeys.veryfi.clientId) {
        await saveSecure('veryfi_client_id', state.apiKeys.veryfi.clientId);
        await saveSecure('veryfi_username', state.apiKeys.veryfi.username);
        await saveSecure('veryfi_api_key', state.apiKeys.veryfi.apiKey);
      }
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [state]);

  const setOnboarded = (value: boolean) => {
    setState(prev => ({ ...prev, isOnboarded: value }));
  };

  const setApiKeys = (keys: { openai: string; elevenlabs: string; veryfi?: { clientId: string; username: string; apiKey: string } }) => {
    setState(prev => ({ 
      ...prev, 
      apiKeys: { 
        ...prev.apiKeys, 
        ...keys,
        veryfi: keys.veryfi || prev.apiKeys.veryfi
      } 
    }));
  };

  const addMedication = (med: Omit<Medication, 'id' | 'taken'>) => {
    const newMed: Medication = {
      ...med,
      id: Date.now().toString(),
      taken: false,
    };
    setState(prev => ({ ...prev, medications: [...prev.medications, newMed] }));
  };

  const toggleMedication = (id: string) => {
    setState(prev => ({
      ...prev,
      medications: prev.medications.map(med =>
        med.id === id ? { ...med, taken: !med.taken } : med
      ),
    }));
  };

  const removeMedication = (id: string) => {
    setState(prev => ({
      ...prev,
      medications: prev.medications.filter(med => med.id !== id),
    }));
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      setOnboarded, 
      setApiKeys, 
      addMedication, 
      toggleMedication, 
      removeMedication,
      loadData,
      saveData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
