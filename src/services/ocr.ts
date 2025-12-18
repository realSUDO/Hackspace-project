// Google Vision OCR Service
export interface OCRResult {
  success: boolean;
  medicineName?: string;
  dosage?: string;
  error?: string;
}

export class OCRService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async processImage(base64Image: string): Promise<OCRResult> {
    try {
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: base64Image,
                },
                features: [
                  {
                    type: 'TEXT_DETECTION',
                    maxResults: 10,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const detectedText = data.responses[0]?.textAnnotations[0]?.description || '';
        
        const medicineName = this.extractMedicineName(detectedText);
        const dosage = this.extractDosage(detectedText);
        
        return {
          success: true,
          medicineName,
          dosage,
        };
      } else {
        throw new Error(`Google Vision API failed: ${response.status}`);
      }
    } catch (error) {
      console.error('OCR error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private extractMedicineName(text: string): string | undefined {
    const patterns = [
      /(?:^|\s)([A-Z][a-z]+(?:in|ol|ide|ate|ine|one|pam|zole|mycin|cillin|pril|sartan|statin))\s/i,
      /(?:^|\s)([A-Z][a-z]{3,})\s+\d+\s*(?:mg|mcg|g|ml|units?)/i,
      /(?:^|\s)([A-Z][a-z]{3,})\s+(?:tablets?|capsules?|pills?)/i,
      /(?:^|\s)([A-Z][a-z]{4,})\s/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const name = match[1].trim();
        if (!this.isCommonWord(name)) {
          return name;
        }
      }
    }
    return undefined;
  }

  private extractDosage(text: string): string | undefined {
    const patterns = [
      /(\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|units?))/i,
      /(\d+\s*(?:mg|mcg|g|ml|units?))/i,
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