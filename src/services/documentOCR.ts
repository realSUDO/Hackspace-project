import TextRecognition from '@react-native-ml-kit/text-recognition';
import { supabase } from './supabase';

export interface DocumentOCRResult {
  success: boolean;
  extractedText?: string;
  documentId?: string;
  error?: string;
}

export class DocumentOCRService {
  async processDocument(
    imageUri: string,
    title: string
  ): Promise<DocumentOCRResult> {
    try {
      console.log('🔄 Starting OCR with image:', imageUri);

      // Extract text using MLKit
      const result = await TextRecognition.recognize(imageUri);
      const extractedText = result.text;
      
      console.log('📝 Extracted text:', extractedText);

      if (!extractedText || extractedText.trim().length === 0) {
        return {
          success: false,
          error: 'No text found in image. Try a clearer photo.',
          extractedText: ''
        };
      }

      // Try to save to database if user is authenticated
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          console.log('💾 User authenticated, saving to database...');
          console.log('👤 User ID:', user.id);
          console.log('📄 Document data:', { title, contentLength: extractedText.length });
          
          const { data, error } = await supabase
            .from('documents')
            .insert({
              title,
              content: extractedText,
              user_id: user.id,
            })
            .select('id')
            .single();

          if (error) {
            console.log('❌ Database save failed:', error);
            console.log('❌ Error details:', {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            });
            // Still return success with extracted text
            return {
              success: true,
              extractedText,
              error: `Database error: ${error.message}`
            };
          }

          console.log('✅ Document saved with ID:', data.id);
          return {
            success: true,
            extractedText,
            documentId: data.id
          };
        } else {
          console.log('⚠️ No authenticated user found');
          // User not authenticated, just return extracted text
          return {
            success: true,
            extractedText,
            error: 'User not authenticated'
          };
        }
      } catch (dbError: any) {
        console.log('❌ Database connection error:', dbError);
        console.log('❌ Full error:', {
          message: dbError.message,
          stack: dbError.stack,
          name: dbError.name
        });
        // Still return success with extracted text
        return {
          success: true,
          extractedText,
          error: `Database connection failed: ${dbError.message}`
        };
      }
    } catch (err: any) {
      console.log('❌ OCR Error:', err);
      return {
        success: false,
        error: `OCR failed: ${err.message}`,
      };
    }
  }
}
