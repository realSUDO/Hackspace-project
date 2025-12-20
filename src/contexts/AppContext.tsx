import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { saveConfig, getConfig, saveSecure, getSecure } from '../services/storage';
import { MedicationService, Medication } from '../services/medicationService';



interface BloodPressureReading {
  systolic: number;
  diastolic: number;
  date: string;
  status: string;
}

interface CholesterolReading {
  total: number;
  ldl: number;
  hdl: number;
  date: string;
  status: string;
}

interface Allergy {
  id: string;
  allergen: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  reaction: string;
}

interface MedicalHistory {
  bloodPressure: BloodPressureReading;
  cholesterol: CholesterolReading;
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
  medicalHistory: MedicalHistory;
  allergies: Allergy[];
}

interface AppContextType {
  state: AppState;
  setOnboarded: (value: boolean) => void;
  setApiKeys: (keys: { openai: string; elevenlabs: string; veryfi?: { clientId: string; username: string; apiKey: string } }) => void;
  addMedication: (med: Omit<Medication, 'id' | 'taken' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  toggleMedication: (id: string) => void;
  removeMedication: (id: string) => void;
  updateBloodPressure: (reading: Omit<BloodPressureReading, 'date' | 'status'>) => void;
  updateCholesterol: (reading: Omit<CholesterolReading, 'date' | 'status'>) => void;
  addAllergy: (allergy: Omit<Allergy, 'id'>) => void;
  removeAllergy: (id: string) => void;
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
  loadMedications: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);


export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    isOnboarded: false,
    apiKeys: { openai: '', elevenlabs: '', veryfi: { clientId: '', username: '', apiKey: '' } },
    medications: [],
    streak: 12,
    medicalHistory: {
      bloodPressure: { systolic: 128, diastolic: 82, date: '2024-01-15', status: 'Normal' },
      cholesterol: { total: 195, ldl: 115, hdl: 45, date: '2024-01-10', status: 'Borderline' }
    },
    allergies: [
      { id: '1', allergen: 'Penicillin', severity: 'Severe', reaction: 'Rash, difficulty breathing' },
      { id: '2', allergen: 'Shellfish', severity: 'Moderate', reaction: 'Hives, swelling' },
      { id: '3', allergen: 'Pollen', severity: 'Mild', reaction: 'Sneezing, runny nose' }
    ],
  });

  const medicationService = new MedicationService();

  const loadMedications = async () => {
    const result = await medicationService.getMedications();
    if (result.success) {
      setState(prev => ({ ...prev, medications: result.medications || [] }));
    }
  };

  const loadData = async () => {
    try {
      const onboarded = await getConfig<boolean>('isOnboarded');
      const streak = await getConfig<number>('streak');
      const medicalHistory = await getConfig<MedicalHistory>('medicalHistory');
      const allergies = await getConfig<Allergy[]>('allergies');
      const openaiKey = await getSecure('openai_key');
      const elevenlabsKey = await getSecure('elevenlabs_key');
      const veryfiClientId = await getSecure('veryfi_client_id');
      const veryfiUsername = await getSecure('veryfi_username');
      const veryfiApiKey = await getSecure('veryfi_api_key');

      setState(prev => ({
        ...prev,
        isOnboarded: onboarded ?? false,
        streak: streak ?? 12,
        medicalHistory: medicalHistory ?? {
          bloodPressure: { systolic: 128, diastolic: 82, date: '2024-01-15', status: 'Normal' },
          cholesterol: { total: 195, ldl: 115, hdl: 45, date: '2024-01-10', status: 'Borderline' }
        },
        allergies: allergies ?? [
          { id: '1', allergen: 'Penicillin', severity: 'Severe', reaction: 'Rash, difficulty breathing' },
          { id: '2', allergen: 'Shellfish', severity: 'Moderate', reaction: 'Hives, swelling' },
          { id: '3', allergen: 'Pollen', severity: 'Mild', reaction: 'Sneezing, runny nose' }
        ],
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
      
      // Load medications from database
      await loadMedications();
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const saveData = async () => {
    try {
      await saveConfig('isOnboarded', state.isOnboarded);
      await saveConfig('streak', state.streak);
      await saveConfig('medicalHistory', state.medicalHistory);
      await saveConfig('allergies', state.allergies);
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

  const addMedication = async (med: Omit<Medication, 'id' | 'taken' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const result = await medicationService.addMedication(med);
    if (result.success) {
      await loadMedications();
    }
  };

  const toggleMedication = async (id: string) => {
    const result = await medicationService.toggleMedication(id);
    if (result.success) {
      await loadMedications();
    }
  };

  const deleteMedication = async (id: string) => {
    const result = await medicationService.deleteMedication(id);
    if (result.success) {
      await loadMedications();
    }
  };

  const updateBloodPressure = (reading: Omit<BloodPressureReading, 'date' | 'status'>) => {
    const status = reading.systolic > 140 || reading.diastolic > 90 ? 'High' : 
                   reading.systolic < 90 || reading.diastolic < 60 ? 'Low' : 'Normal';
    
    setState(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        bloodPressure: {
          ...reading,
          date: new Date().toISOString().split('T')[0],
          status
        }
      }
    }));
  };

  const updateCholesterol = (reading: Omit<CholesterolReading, 'date' | 'status'>) => {
    const status = reading.total > 240 ? 'High' : 
                   reading.total > 200 ? 'Borderline' : 'Normal';
    
    setState(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        cholesterol: {
          ...reading,
          date: new Date().toISOString().split('T')[0],
          status
        }
      }
    }));
  };

  const addAllergy = (allergy: Omit<Allergy, 'id'>) => {
    const newAllergy: Allergy = {
      ...allergy,
      id: Date.now().toString(),
    };
    setState(prev => ({ ...prev, allergies: [...prev.allergies, newAllergy] }));
  };

  const removeAllergy = (id: string) => {
    setState(prev => ({
      ...prev,
      allergies: prev.allergies.filter(allergy => allergy.id !== id),
    }));
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      setOnboarded, 
      setApiKeys, 
      addMedication, 
      toggleMedication, 
      removeMedication: deleteMedication,
      updateBloodPressure,
      updateCholesterol,
      addAllergy,
      removeAllergy,
      loadData,
      saveData,
      loadMedications
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
