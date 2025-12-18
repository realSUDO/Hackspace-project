import TextRecognition from '@react-native-ml-kit/text-recognition';

export interface OCRResult {
  success: boolean;
  medicineName?: string;
  dosage?: string;
  error?: string;
}

export class MLKitService {
  async processImage(imageUri: string): Promise<OCRResult> {
    try {
      const result = await TextRecognition.recognize(imageUri);
      const extractedText = result.text;
      
      const medicineName = this.extractMedicineName(extractedText);
      const dosage = this.extractDosage(extractedText);
      
      return {
        success: true,
        medicineName,
        dosage,
      };
    } catch (error) {
      console.error('ML Kit OCR error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'OCR failed',
      };
    }
  }

  private extractMedicineName(text: string): string | undefined {
    const patterns = [
      /(?:^|\s)([A-Z][a-z]+(?:in|ol|ide|ate|ine|one|pam|zole|mycin|cillin|pril|sartan|statin))\s/i,
      /(?:^|\s)([A-Z][a-z]{3,})\s+\d+\s*(?:mg|mcg|g|ml|units?)/i,
      /(?:^|\s)([A-Z][a-z]{3,})\s+(?:tablets?|capsules?|pills?)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1] && !this.isCommonWord(match[1])) {
        return match[1].trim();
      }
    }
    return undefined;
  }

  private extractDosage(text: string): string | undefined {
    const patterns = [
      /(\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|units?))/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return undefined;
  }

  private isCommonWord(word: string): boolean {
    const commonWords = [
      'tablet', 'capsule', 'medicine', 'prescription', 'pharmacy', 
      'bottle', 'label', 'directions', 'warning', 'caution',
      'take', 'with', 'food', 'water', 'daily', 'twice'
    ];
    return commonWords.includes(word.toLowerCase());
  }
}