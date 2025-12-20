import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Scan, FileSearch, Pill, LoaderCircle, Sparkles } from 'lucide-react-native';

const navItems = [
  { icon: 'pill', label: 'Add', path: '/(tabs)/explore', key: 'add' },
  { icon: 'file-search', label: 'Docs', path: '/docs', key: 'docs' },
  { icon: 'loader-circle', label: 'Report', path: '/report', key: 'report' },
  { icon: 'sparkles', label: 'Assistant', path: '/modal', key: 'assistant' },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View className="absolute bottom-0 left-0 right-0 z-50">
      {/* Floating Scan Button */}
      <View style={{ position: 'absolute', top: -71, left: '50%', marginLeft: -64, zIndex: 10 }}>
        <TouchableOpacity
          onPress={() => router.push('/scan' as any)}
          className="w-32 h-32 bg-green-400 rounded-full items-center justify-center border-4 border-white"
        >
          <Scan size={40} color="white" />
        </TouchableOpacity>
      </View>
      
      <View className="bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <View className="flex-row items-center justify-between w-full px-4">
          {navItems.map((item, index) => {
            // Skip the scan item since it's now the floating button
            if (item.key === 'scan') return null;
            
            const isActive = pathname === item.path || 
              (item.path === '/(tabs)' && pathname === '/(tabs)/index');
            
            // Add custom positioning for docs and report
            let extraStyle = '';
            if (item.key === 'docs') extraStyle = '-ml-24';
            if (item.key === 'report') extraStyle = '-mr-24';
            
            // Render appropriate icon
            const renderIcon = () => {
              const iconColor = isActive ? '#2563eb' : '#6b7280';
              const iconSize = 20;
              
              switch (item.icon) {
                case 'pill':
                  return <Pill size={iconSize} color={iconColor} />;
                case 'file-search':
                  return <FileSearch size={iconSize} color={iconColor} />;
                case 'loader-circle':
                  return <LoaderCircle size={iconSize} color={iconColor} />;
                case 'sparkles':
                  return <Sparkles size={iconSize} color={iconColor} />;
                default:
                  return <Text className={`text-xl ${isActive ? 'scale-110' : 'scale-100'}`}>{item.icon}</Text>;
              }
            };
            
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => router.push(item.path as any)}
                className={`flex flex-col items-center gap-1 py-2 px-2 rounded-xl ${extraStyle}`}
              >
                {renderIcon()}
                <Text className={`text-[10px] font-medium ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                  {item.label}
                </Text>
                {isActive && (
                  <View 
                    key={`${item.key}-indicator`}
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-blue-600" 
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
