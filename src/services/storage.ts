import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SECURE_PREFIX = 'secure_';
const CONFIG_PREFIX = 'config_';

export async function saveSecure(key: string, value: string) {
  if (!key || !value) return;
  await SecureStore.setItemAsync(SECURE_PREFIX + key, value);
}

export async function getSecure(key: string) {
  if (!key) return null;
  return SecureStore.getItemAsync(SECURE_PREFIX + key);
}

export async function deleteSecure(key: string) {
  if (!key) return;
  await SecureStore.deleteItemAsync(SECURE_PREFIX + key);
}

export async function saveConfig<T>(key: string, value: T) {
  if (!key) return;
  await AsyncStorage.setItem(CONFIG_PREFIX + key, JSON.stringify(value));
}

export async function getConfig<T>(key: string): Promise<T | null> {
  if (!key) return null;
  const raw = await AsyncStorage.getItem(CONFIG_PREFIX + key);
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function clearAllConfig() {
  const keys = await AsyncStorage.getAllKeys();
  const configKeys = keys.filter((k) => k.startsWith(CONFIG_PREFIX));
  if (configKeys.length) {
    await AsyncStorage.multiRemove(configKeys);
  }
}
