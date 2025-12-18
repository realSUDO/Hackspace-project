# Medicine Scan Feature

## Overview
The scan feature allows users to take photos of medicine bottles/packages and automatically extract medication information using React Native ML Kit text recognition.

## How it works
1. User taps "Scan" button in Quick Actions on Dashboard
2. Camera opens to take a photo of the medicine
3. Image URI is processed using ML Kit text recognition
4. Medicine name and dosage are extracted from the detected text
5. Add Medication form opens with prefilled information
6. User can review and save the medication

## Files Added/Modified

### New Files:
- `src/components/ScanScreen.tsx` - Main scan interface
- `src/services/mlkit.ts` - ML Kit text recognition service
- `app/scan.tsx` - Scan route handler

### Modified Files:
- `src/components/Dashboard.tsx` - Added scan navigation
- `app/(tabs)/index.tsx` - Added scan route handling
- `app/(tabs)/explore.tsx` - Added prefilled data support
- `package.json` - Added camera dependencies

## Dependencies Added
- `expo-image-picker` - For camera functionality
- `expo-media-library` - For media access
- `@react-native-ml-kit/text-recognition` - For OCR functionality

## ML Kit Integration
The app uses React Native ML Kit for on-device text recognition. No API keys or internet connection required.

## Permissions Required
- Camera access (already configured in app.json)
- Photo library access (already configured in app.json)

## Usage
1. Open the app
2. Go to Dashboard
3. Tap "Scan" in Quick Actions
4. Take a photo of medicine bottle/package
5. Review the prefilled medication form
6. Save the medication