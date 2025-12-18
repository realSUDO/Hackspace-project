export interface OCRResult {
  success: boolean;
  medicineName?: string;
  dosage?: string;
  error?: string;
}

export class SimpleOCRService {
  async processImage(imageUri: string): Promise<OCRResult> {
    try {
      // For demo purposes, simulate OCR with common medicine patterns
      // In a real app, you'd use a cloud OCR service like Google Vision API
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock OCR results based on common medicine names
      const mockResults = [
        { medicineName: 'Aspirin', dosage: '81mg' },
        { medicineName: 'Ibuprofen', dosage: '200mg' },
        { medicineName: 'Acetaminophen', dosage: '500mg' },
        { medicineName: 'Lisinopril', dosage: '10mg' },
        { medicineName: 'Metformin', dosage: '500mg' },
      ];
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      
      return {
        success: true,
        medicineName: randomResult.medicineName,
        dosage: randomResult.dosage,
      };
    } catch (error) {
      console.error('OCR error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'OCR failed',
      };
    }
  }
}