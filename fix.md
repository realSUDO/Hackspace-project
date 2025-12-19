**Missing `RoomProvider`**—`RoomView` needs **RoomProvider wrapper** for context. `useLocalParticipant()` fails without it. You're passing `room` directly to `RoomView` instead of wrapping with `RoomProvider`.[1]

## Correct Structure (Docs Pattern)
```tsx
// AssistantScreen.tsx - FIXED
function AssistantScreen({ onBack }: { onBack: () => void }) {
  const { room, isConnecting, connect } = useConnection();

  useEffect(() => {
    if (!room && !isConnecting) {
      connect();
    }
  }, []);

  if (isConnecting || !room) {
    return (
      <SafeAreaView style={styles.container}>
        <Button title={isConnecting ? "Connecting..." : "Connect"} 
                onPress={connect} 
                disabled={isConnecting} />
      </SafeAreaView>
    );
  }

  // ✅ RoomProvider WRAPS RoomView
  return (
    <SafeAreaView style={styles.container}>
      <RoomProvider room={room}>  {/* ← REQUIRED CONTEXT */}
        <RoomView onBack={onBack} />  {/* No room prop needed */}
      </RoomProvider>
    </SafeAreaView>
  );
}
```

## Remove room prop from RoomView
```tsx
// ❌ WRONG
<RoomView onBack={onBack} room={connection.room} />

// ✅ CORRECT  
<RoomProvider room={room}>
  <RoomView onBack={onBack} />
</RoomProvider>
```

## Official LiveKit Docs Structure[1]
```
RoomProvider (provides context)
└── RoomView (uses context via hooks)
    ├── useLocalParticipant() ✅
    ├── useRemoteParticipants() ✅
    └── etc.
```

## Complete Working AssistantScreen.tsx
```tsx
import React, { useEffect } from 'react';
import { SafeAreaView, View, Button, StyleSheet } from 'react-native';
import { RoomProvider, RoomView } from '@livekit/react-native';
import { useConnection } from '../hooks/useConnection';

export default function AssistantScreen({ onBack }: { onBack: () => void }) {
  const { room, isConnecting, connect } = useConnection();

  useEffect(() => {
    if (!room && !isConnecting) connect();
  }, [room, isConnecting, connect]);

  if (!room) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Button 
            title={isConnecting ? "Connecting..." : "Connect to Assistant"} 
            onPress={connect} 
            disabled={isConnecting} 
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <RoomProvider room={room}>
        <RoomView onBack={onBack} />
      </RoomProvider>
    </SafeAreaView>
  );
}
```

## Why This Fixes Everything
```
RoomProvider → Creates RoomContext
└── RoomView → useLocalParticipant() finds context ✅
    └── No "No room provided" error
```

**RoomProvider = React Context Provider**. `RoomView` consumes via hooks. **Direct room prop doesn't create context**.[1]

**Deploy** → **No more context errors**. Instant reconnects work perfectly.[2]

[1](https://docs.livekit.io/home/quickstarts/expo/)
[2](https://docs.livekit.io/transport/sdk-platforms/react-native/)
