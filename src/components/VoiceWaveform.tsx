import React, { useEffect, useRef } from 'react';
import { View, Animated, Text } from 'react-native';

interface VoiceWaveformProps {
  isActive: boolean;
  size?: number;
}

export function VoiceWaveform({ isActive, size = 240 }: VoiceWaveformProps) {
  const animations = useRef(
    Array.from({ length: 5 }, () => new Animated.Value(0.3))
  ).current;

  useEffect(() => {
    if (isActive) {
      const animateWave = () => {
        const animationPromises = animations.map((anim, index) => {
          return Animated.sequence([
            Animated.delay(index * 100),
            Animated.loop(
              Animated.sequence([
                Animated.timing(anim, {
                  toValue: 1,
                  duration: 500 + Math.random() * 500,
                  useNativeDriver: false,
                }),
                Animated.timing(anim, {
                  toValue: 0.3,
                  duration: 500 + Math.random() * 500,
                  useNativeDriver: false,
                }),
              ])
            ),
          ]);
        });

        Animated.parallel(animationPromises).start();
      };

      animateWave();
    } else {
      animations.forEach(anim => {
        anim.setValue(0.3);
      });
    }
  }, [isActive, animations]);

  return (
    <View 
      className="items-center justify-center bg-primary/10 rounded-full border-4 border-primary/20"
      style={{ width: size, height: size }}
    >
      <View className="flex-row items-end justify-center space-x-2">
        {animations.map((anim, index) => (
          <Animated.View
            key={index}
            className="bg-primary rounded-full"
            style={{
              width: 8,
              height: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 60],
              }),
            }}
          />
        ))}
      </View>
      
      {/* Center microphone icon */}
      <View className="absolute items-center justify-center">
        <View className="w-16 h-16 bg-primary rounded-full items-center justify-center">
          <Text className="text-2xl text-primary-foreground">🎤</Text>
        </View>
      </View>
    </View>
  );
}
