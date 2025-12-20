import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useScreenReader() {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  useEffect(() => {
    const checkScreenReader = async () => {
      const enabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(enabled);
    };

    checkScreenReader();

    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setIsScreenReaderEnabled
    );

    return () => subscription?.remove();
  }, []);

  return isScreenReaderEnabled;
}

export const announceForAccessibility = (message: string) => {
  AccessibilityInfo.announceForAccessibility(message);
};
