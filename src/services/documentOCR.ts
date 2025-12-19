import TextRecognition from '@react-native-ml-kit/text-recognition';
import { supabase } from './supabase';

export interface DocumentOCRResult {
  success: boolean;
  documentId?: string;
  error?: string;
}

export class DocumentOCRService {
  async processDocument(
    imageUri: string,
    title: string
  ): Promise<DocumentOCRResult> {
    try {
      console.log('🔄 Step 1: Starting OCR');

      // 1️⃣ OCR
      const result = await TextRecognition.recognize(imageUri);
      const extractedText = result.text;

      if (!extractedText) {
        throw new Error('No text extracted');
      }

      console.log('✅ Step 2: OCR completed');

      // 2️⃣ Get authenticated user (THIS IS THE UUID SOURCE)
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.log('❌ Auth error:', authError);
        throw authError;
      }

      if (!user) {
        throw new Error('User not logged in');
      }

      const userId = user.id; // ✅ UUID from Supabase Auth
      console.log('✅ Step 3: User authenticated:', userId);

      // 3️⃣ Insert into Supabase
      console.log('🔄 Step 4: Inserting into Supabase...');

      const { data, error } = await supabase
        .from('documents')
        .insert({
          title,
          content: extractedText,
          user_id: userId,
        })
        .select('id')
        .single();

      if (error) {
        console.log('❌ Step 5: Supabase insert failed:', error);
        throw error;
      }

      console.log('✅ Step 6: Document saved:', data.id);

      return {
        success: true,
        documentId: data.id,
      };
    } catch (err: any) {
      console.log('❌ Error in processDocument:', err);

      return {
        success: false,
        error: 'Document OCR failed',
      };
    }
  }
}
