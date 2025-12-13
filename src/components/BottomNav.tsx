import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

const navItems = [
  { icon: '🏠', label: 'Home', path: '/(tabs)', key: 'home' },
  { icon: '➕', label: 'Add', path: '/(tabs)/explore', key: 'add' },
  { icon: '📊', label: 'Report', path: '/report', key: 'report' },
  { icon: '💬', label: 'Assistant', path: '/modal', key: 'assistant' },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View className="absolute bottom-0 left-0 right-0 z-50">
      <View className="bg-card/60 border-t border-border/50 px-8 py-4">
        <View className="flex-row items-center justify-between w-full">
          {navItems.map((item) => {
            const isActive = pathname === item.path || 
              (item.path === '/(tabs)' && pathname === '/(tabs)/index');
            
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => router.push(item.path as any)}
                className="flex flex-col items-center gap-2 py-2 px-8 rounded-xl"
              >
                <Text 
                  key={`${item.key}-icon`}
                  className={`text-2xl ${isActive ? 'scale-110' : 'scale-100'}`}
                >
                  {item.icon}
                </Text>
                <Text 
                  key={`${item.key}-label`}
                  className={`text-xs font-medium ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </Text>
                {isActive && (
                  <View 
                    key={`${item.key}-indicator`}
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary" 
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
