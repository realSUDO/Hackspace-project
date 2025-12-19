import { TokenSource, TokenSourceResponseObject } from 'livekit-client';
import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { SessionProvider, useSession } from '@livekit/components-react';

const LIVEKIT_URL = 'wss://pulse-xb2sfvab.livekit.cloud';
const TOKEN_SERVER_URL = 'https://node-token-98yjndw9t-untold.vercel.app/getToken';

interface ConnectionContextType {
  isConnectionActive: boolean;
  connect: () => void;
  disconnect: () => void;
}

const ConnectionContext = createContext<ConnectionContextType>({
  isConnectionActive: false,
  connect: () => {},
  disconnect: () => {},
});

export function useConnection() {
  const ctx = useContext(ConnectionContext);
  if (!ctx) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return ctx;
}

interface ConnectionProviderProps {
  children: React.ReactNode;
}

export function ConnectionProvider({ children }: ConnectionProviderProps) {
  const [isConnectionActive, setIsConnectionActive] = useState(false);
  const [currentToken, setCurrentToken] = useState<string>('');

  const fetchFreshToken = async (room?: string, identity?: string) => {
    try {
      const roomName = room || 'quickstart-room';
      const participantId = identity || `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      
      console.log(`🔑 Fetching fresh token for room: ${roomName}, identity: ${participantId}`);
      const response = await fetch(`${TOKEN_SERVER_URL}?room=${roomName}&identity=${participantId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const token = await response.text();
      console.log('✅ Fresh token received with unique identity');
      return token;
    } catch (error) {
      console.error('❌ Failed to fetch token:', error);
      throw error;
    }
  };

  const tokenSource = useMemo(() => {
    if (!currentToken) {
      return TokenSource.literal({
        serverUrl: LIVEKIT_URL,
        participantToken: '',
      } satisfies TokenSourceResponseObject);
    }
    
    console.log('🔗 Creating token source with fresh token');
    return TokenSource.literal({
      serverUrl: LIVEKIT_URL,
      participantToken: currentToken,
    } satisfies TokenSourceResponseObject);
  }, [currentToken]);

  const session = useSession(tokenSource, { agentName: '' });
  const { start: startSession, end: endSession } = session;

  useEffect(() => {
    if (currentToken && isConnectionActive) {
      console.log('🎯 Token ready, starting session...');
      startSession();
    }
  }, [currentToken, isConnectionActive, startSession]);

  const value = useMemo(() => {
    return {
      isConnectionActive,
      connect: async () => {
        console.log('🚀 Connecting to voice assistant...');
        const newIdentity = `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const newRoom = `quickstart-room-${Date.now().toString().slice(-6)}`;
        
        console.log(`🏠 Creating new room: ${newRoom} for identity: ${newIdentity}`);
        const token = await fetchFreshToken(newRoom, newIdentity);
        setCurrentToken(token);
        setIsConnectionActive(true);
      },
      disconnect: () => {
        console.log('🔌 Disconnecting from voice assistant...');
        setIsConnectionActive(false);
        setCurrentToken('');
        endSession();
      },
    };
  }, [endSession, isConnectionActive]);

  return (
    <SessionProvider session={session}>
      <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>
    </SessionProvider>
  );
}
