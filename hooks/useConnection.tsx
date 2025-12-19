import { TokenSource, TokenSourceResponseObject } from 'livekit-client';
import { createContext, useContext, useMemo, useState } from 'react';
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

  const hardcodedToken = async () => {
    const newIdentity = `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newRoom = `quickstart-room-${Date.now().toString().slice(-6)}`;
    const response = await fetch(`${TOKEN_SERVER_URL}?room=${newRoom}&identity=${newIdentity}`);
    return await response.text();
  };

  const tokenSource = useMemo(() => {
    return TokenSource.literal(
      async () => ({
        serverUrl: LIVEKIT_URL,
        participantToken: await hardcodedToken(),
      })
    );
  }, []);

  const session = useSession(tokenSource, { agentName: '' });
  const { start: startSession, end: endSession } = session;

  const value = useMemo(() => {
    return {
      isConnectionActive,
      connect: () => {
        if (isConnectionActive) {
          console.log('⏭️ Already connected');
          return;
        }
        console.log('🚀 Connecting to voice assistant...');
        setIsConnectionActive(true);
        startSession();
      },
      disconnect: () => {
        console.log('🔌 Disconnecting from voice assistant...');
        setIsConnectionActive(false);
        endSession();
      },
    };
  }, [startSession, endSession, isConnectionActive]);

  return (
    <SessionProvider session={session}>
      <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>
    </SessionProvider>
  );
}
