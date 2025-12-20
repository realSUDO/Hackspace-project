import { supabase } from './supabase';

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  taken: boolean;
  created_at: string;
  updated_at: string;
}

export class MedicationService {
  async getMedications(): Promise<{ success: boolean; medications?: Medication[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id)
        .order('time', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, medications: data || [] };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async addMedication(medication: Omit<Medication, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('medications')
        .insert({
          ...medication,
          user_id: user.id
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async deleteMedication(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async toggleMedication(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // First get current state
      const { data: med, error: fetchError } = await supabase
        .from('medications')
        .select('taken')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        return { success: false, error: fetchError.message };
      }

      // Toggle the taken state
      const { error } = await supabase
        .from('medications')
        .update({ taken: !med.taken })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}
