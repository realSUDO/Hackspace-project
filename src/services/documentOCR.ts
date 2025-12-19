import TextRecognition from '@react-native-ml-kit/text-recognition';
import { supabase } from './supabase';

export interface DocumentOCRResult {
  success: boolean;
  extractedText?: string;
  documentId?: string;
  error?: string;
}

export class DocumentOCRService {
  async extractTextFromImage(imageUri: string): Promise<string> {
    try {
      const result = await TextRecognition.recognize(imageUri);
      return result.text || '';
    } catch (error) {
      console.error('Image OCR failed:', error);
      return '';
    }
  }

  async extractTextFromPDF(pdfUri: string): Promise<string> {
    try {
      console.log('Sending PDF to backend for text extraction:', pdfUri);
      
      // Read PDF file as base64
      const response = await fetch(pdfUri);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove data:application/pdf;base64, prefix
        };
        reader.readAsDataURL(blob);
      });

      // Call Python backend for PDF text extraction
      const extractResponse = await fetch('https://pdf-parser-production-186a.up.railway.app/extract-pdf-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pdf_base64: base64 }),
      });

      if (!extractResponse.ok) {
        throw new Error(`Backend error: ${extractResponse.status}`);
      }

      const result = await extractResponse.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      console.log('Extracted text from backend:', result.text.substring(0, 200));
      return result.text;
      
    } catch (error) {
      console.log('PDF backend extraction failed:', error);
      throw new Error('PDF text extraction failed. Please convert to images and upload those instead.');
    }
  }

  async processDocument(
    fileUri: string,
    title: string,
    isPDF: boolean = false
  ): Promise<DocumentOCRResult> {
    try {
      console.log('🔄 Starting document processing:', { fileUri, isPDF });

      let extractedText = '';
      
      if (isPDF) {
        // Handle PDF - try text extraction, don't fallback to OCR since it can't handle PDFs
        try {
          extractedText = await this.extractTextFromPDF(fileUri);
        } catch (error) {
          console.log('PDF processing not supported:', error);
          return {
            success: false,
            error: 'PDF text extraction requires backend processing. Please:\n\n1. Take screenshots of PDF pages\n2. Upload the images instead\n\nFull PDF support coming soon!'
          };
        }
      } else {
        // Handle image - use OCR
        const result = await TextRecognition.recognize(fileUri);
        extractedText = result.text;
      }
      
      console.log('📝 Extracted text length:', extractedText.length);

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
          
          // Upload original file to Supabase Storage
          let fileUrl = null;
          try {
            const fileExt = isPDF ? 'pdf' : 'jpg';
            const fileName = `${Date.now()}.${fileExt}`;
            
            // Read file as ArrayBuffer for better compatibility
            const response = await fetch(fileUri);
            const arrayBuffer = await response.arrayBuffer();
            
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('documents')
              .upload(`${user.id}/${fileName}`, arrayBuffer, {
                contentType: isPDF ? 'application/pdf' : 'image/jpeg',
                upsert: false
              });
              
            if (uploadError) {
              console.error('File upload error:', uploadError);
              // Continue without file URL - document will still save
            } else {
              fileUrl = uploadData.path;
              console.log('✅ File uploaded to:', fileUrl);
            }
          } catch (uploadErr) {
            console.error('File upload failed:', uploadErr);
            // Continue without file URL - document will still save
          }
          
          const { data, error } = await supabase
            .from('documents')
            .insert({
              title,
              full_text: extractedText,  // Use full_text for tsvector indexing
              user_id: user.id,
              file_url: fileUrl, // Store the file path
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
