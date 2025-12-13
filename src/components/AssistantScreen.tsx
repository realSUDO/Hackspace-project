import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VoiceWaveform } from './VoiceWaveform';

interface AssistantScreenProps {
  onBack: () => void;
}

export function AssistantScreen({ onBack }: AssistantScreenProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  const handleToggleListening = () => {
    if (isListening) {
      setIsListening(false);
      // Simulate AI response
      setTranscript("What medications do I need to take today?");
      setTimeout(() => {
        setIsSpeaking(true);
        setResponse("You have 5 medications scheduled for today. You've already taken Vitamin D and Omega-3 this morning. Your next dose is Metformin 500mg at noon. Would you like me to set a reminder?");
        setTimeout(() => setIsSpeaking(false), 5000);
      }, 1000);
    } else {
      setIsListening(true);
      setTranscript('');
      setResponse('');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="p-6 pb-4">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              onPress={onBack}
              className="w-10 h-10 rounded-full bg-muted items-center justify-center"
            >
              <Text className="text-lg">←</Text>
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-foreground">AI Assistant</Text>
              <Text className="text-muted-foreground text-sm">
                {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Tap to speak'}
              </Text>
            </View>
            <View className={`w-3 h-3 rounded-full ${
              isListening ? 'bg-destructive' : isSpeaking ? 'bg-green-400' : 'bg-muted'
            }`} />
          </View>
        </View>
        
        {/* Main waveform area */}
        <View className="flex-1 items-center justify-center px-6">
          <View className="relative mb-8">
            <VoiceWaveform isActive={isListening || isSpeaking} size={240} />
            
            {/* Status indicator */}
            <View className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <View className={`flex-row items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border ${
                isListening ? 'border-destructive/50' : isSpeaking ? 'border-green-500/50' : 'border-border'
              }`}>
                {isListening ? (
                  <>
                    <View className="w-2 h-2 rounded-full bg-destructive" />
                    <Text className="text-sm text-foreground">Recording</Text>
                  </>
                ) : isSpeaking ? (
                  <>
                    <Text className="text-green-400">🔊</Text>
                    <Text className="text-sm text-foreground">Speaking</Text>
                  </>
                ) : (
                  <Text className="text-sm text-muted-foreground">Ready</Text>
                )}
              </View>
            </View>
          </View>
          
          {/* Transcript area */}
          <ScrollView className="w-full max-w-sm min-h-[160px]">
            {transcript && (
              <View className="bg-muted/30 rounded-2xl p-4 mb-4 border border-border/50">
                <Text className="text-xs text-muted-foreground mb-1">You said:</Text>
                <Text className="text-foreground">{transcript}</Text>
              </View>
            )}
            
            {response && (
              <View className="bg-muted/30 rounded-2xl p-4 border-l-4 border-primary border border-border/50">
                <Text className="text-xs text-primary mb-1">Pulse:</Text>
                <Text className="text-foreground">{response}</Text>
              </View>
            )}
          </ScrollView>
        </View>
        
        {/* Control button */}
        <View className="p-6 pt-4">
          <TouchableOpacity
            className={`w-full py-4 px-6 rounded-2xl ${
              isListening ? 'bg-destructive' : 'bg-primary'
            }`}
            onPress={handleToggleListening}
          >
            <View className="flex-row items-center justify-center gap-3">
              <Text className="text-2xl text-white">
                {isListening ? '🛑' : '🎤'}
              </Text>
              <Text className="text-white text-lg font-semibold">
                {isListening ? 'Stop Listening' : 'Start Speaking'}
              </Text>
            </View>
          </TouchableOpacity>
          
          <Text className="text-center text-muted-foreground text-sm mt-4">
            Ask about your medications, schedule, or health tips
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
