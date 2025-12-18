import VeryfiLens from '@veryfi/react-native-veryfi-lens';
import { NativeEventEmitter } from 'react-native';

export interface OCRResult {
  success: boolean;
  medicineName?: string;
  dosage?: string;
  error?: string;
}

export class VeryfiService {
  private clientId: string;
  private username: string;
  private apiKey: string;

  constructor(config: { clientId: string; username: string; apiKey: string }) {
    this.clientId = config.clientId;
    this.username = config.username;
    this.apiKey = config.apiKey;
  }

  async processImage(): Promise<OCRResult> {
    return new Promise((resolve) => {
      const veryfiLensCredentials = {
        url: process.env.EXPO_PUBLIC_VERYFI_URL || 'api.veryfi.com',
        clientId: this.clientId,
        userName: this.username,
        apiKey: this.apiKey,
      };

      const veryfiLensSettings = {
        blurDetectionIsOn: true,
        autoLightDetectionIsOn: false,
        backupDocsToGallery: false,
        autoDocDetectionAndCropIsOn: true,
        showDocumentTypes: false,
        dataExtractionEngine: 1,
        documentTypes: ['receipt'],
        moreMenuIsOn: false,
        originalImageMaxSize: 2.0,
      };

      const VeryfiLensEmitter = new NativeEventEmitter(VeryfiLens);

      const successListener = VeryfiLensEmitter.addListener(
        VeryfiLens.getConstants().onVeryfiLensSuccess,
        (event) => {
          console.log('Veryfi success:', event);
          const medicineName = this.extractMedicineName(event.ocr_text || '');
          const dosage = this.extractDosage(event.ocr_text || '');
          
          successListener.remove();
          errorListener.remove();
          closeListener.remove();
          
          resolve({
            success: true,
            medicineName,
            dosage,
          });
        }
      );

      const errorListener = VeryfiLensEmitter.addListener(
        VeryfiLens.getConstants().onVeryfiLensError,
        (event) => {
          console.log('Veryfi error:', event);
          successListener.remove();
          errorListener.remove();
          closeListener.remove();
          
          resolve({
            success: false,
            error: event.msg || 'OCR failed',
          });
        }
      );

      const closeListener = VeryfiLensEmitter.addListener(
        VeryfiLens.getConstants().onVeryfiLensClose,
        (event) => {
          console.log('Veryfi closed:', event);
          if (event.session_scan_count === 0) {
            successListener.remove();
            errorListener.remove();
            closeListener.remove();
            
            resolve({
              success: false,
              error: 'Scan cancelled',
            });
          }
        }
      );

      VeryfiLens.configureWithCredentials(
        veryfiLensCredentials,
        veryfiLensSettings,
        () => {
          VeryfiLens.showCamera();
        }
      );
    });
  }

  private extractMedicineName(text: string): string | undefined {
    const patterns = [
      /(?:^|\s)([A-Z][a-z]+(?:in|ol|ide|ate|ine|one|pam|zole|mycin|cillin|pril|sartan|statin))\s/i,
      /(?:^|\s)([A-Z][a-z]{3,})\s+\d+\s*(?:mg|mcg|g|ml|units?)/i,
      /(?:^|\s)([A-Z][a-z]{3,})\s+(?:tablets?|capsules?|pills?)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
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
}