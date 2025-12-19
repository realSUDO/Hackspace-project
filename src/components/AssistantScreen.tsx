import {
  Animated,
  Dimensions,
  StyleSheet,
  useAnimatedValue,
  View,
  ViewStyle,
} from 'react-native';

import React, { useCallback, useEffect, useState } from 'react';
import {
  AudioSession,
  useIOSAudioManagement,
  useLocalParticipant,
  useParticipantTracks,
  useRoomContext,
  VideoTrack,
} from '@livekit/react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ControlBar from './ui/ControlBar';
import ChatLog from './ui/ChatLog';
import AgentVisualization from './ui/AgentVisualization';
import { Track } from 'livekit-client';
import {
  TrackReference,
  useSessionMessages,
  useTrackToggle,
} from '@livekit/components-react';
import { useConnection } from '../../hooks/useConnection';

interface AssistantScreenProps {
  onBack: () => void;
}

export function AssistantScreen({ onBack }: AssistantScreenProps) {
  const connection = useConnection();

  useEffect(() => {
    let start = async () => {
      await AudioSession.startAudioSession();
      
      // Auto-connect once on mount
      if (!connection.isConnectionActive) {
        console.log('Auto-connecting to voice assistant...');
        connection.connect();
      }
    };
    start();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []); // Empty dependency array - only run once on mount

  return (
    <SafeAreaView style={styles.container}>
      <RoomView onBack={onBack} />
    </SafeAreaView>
  );
}

const RoomView = ({ onBack }: { onBack: () => void }) => {
  const connection = useConnection();
  const room = useRoomContext();

  useIOSAudioManagement(room, true);

  const {
    isMicrophoneEnabled,
    isCameraEnabled,
    isScreenShareEnabled,
    cameraTrack: localCameraTrack,
    localParticipant,
  } = useLocalParticipant();
  const localParticipantIdentity = localParticipant.identity;

  const localScreenShareTrack = useParticipantTracks(
    [Track.Source.ScreenShare],
    localParticipantIdentity
  );

  const localVideoTrack =
    localCameraTrack && isCameraEnabled
      ? ({
          participant: localParticipant,
          publication: localCameraTrack,
          source: Track.Source.Camera,
        } satisfies TrackReference)
      : localScreenShareTrack.length > 0 && isScreenShareEnabled
      ? localScreenShareTrack[0]
      : null;

  // Messages
  const { messages } = useSessionMessages();
  const [isChatEnabled, setChatEnabled] = useState(true);

  // Control callbacks
  const micToggle = useTrackToggle({ source: Track.Source.Microphone });
  const cameraToggle = useTrackToggle({ source: Track.Source.Camera });
  const screenShareToggle = useTrackToggle({
    source: Track.Source.ScreenShare,
  });
  const onChatClick = useCallback(() => {
    setChatEnabled(!isChatEnabled);
  }, [isChatEnabled, setChatEnabled]);
  const onExitClick = useCallback(() => {
    console.log('Disconnecting and exiting...');
    connection.disconnect();
    onBack();
  }, [connection, onBack]);

  // Layout positioning
  const [containerWidth, setContainerWidth] = useState(
    Dimensions.get('window').width
  );
  const [containerHeight, setContainerHeight] = useState(
    Dimensions.get('window').height
  );
  const agentVisualizationPosition = useAgentVisualizationPosition(
    isChatEnabled,
    isCameraEnabled || isScreenShareEnabled
  );
  const localVideoPosition = useLocalVideoPosition(isChatEnabled, {
    width: containerWidth,
    height: containerHeight,
  });

  let localVideoView = localVideoTrack ? (
    <Animated.View
      style={[
        {
          position: 'absolute',
          zIndex: 1,
          ...localVideoPosition,
        },
      ]}
    >
      <VideoTrack trackRef={localVideoTrack} style={styles.video} />
    </Animated.View>
  ) : null;

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerWidth(width);
        setContainerHeight(height);
      }}
    >
      <View style={styles.spacer} />
      <ChatLog style={styles.logContainer} messages={messages} />

      <Animated.View
        style={[
          {
            position: 'absolute',
            zIndex: 1,
            backgroundColor: '#000000',
            ...agentVisualizationPosition,
          },
        ]}
      >
        <AgentVisualization style={styles.agentVisualization} />
      </Animated.View>

      {localVideoView}

      <ControlBar
        style={styles.controlBar}
        options={{
          isMicEnabled: isMicrophoneEnabled,
          isCameraEnabled,
          isScreenShareEnabled,
          isChatEnabled,
          onMicClick: micToggle.toggle,
          onCameraClick: cameraToggle.toggle,
          onChatClick,
          onScreenShareClick: screenShareToggle.toggle,
          onExitClick,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  spacer: {
    height: '24%',
  },
  logContainer: {
    width: '100%',
    flexGrow: 1,
    flexDirection: 'column',
    marginBottom: 8,
  },
  controlBar: {
    left: 0,
    right: 0,
    zIndex: 2,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  agentVisualization: {
    width: '100%',
    height: '100%',
  },
});

const expandedAgentWidth = 1;
const expandedAgentHeight = 1;
const expandedLocalWidth = 0.3;
const expandedLocalHeight = 0.2;
const collapsedWidth = 0.3;
const collapsedHeight = 0.2;

const createAnimConfig = (toValue: any) => {
  return {
    toValue,
    stiffness: 200,
    damping: 30,
    useNativeDriver: false,
    isInteraction: false,
    overshootClamping: true,
  };
};

const useAgentVisualizationPosition = (
  isChatVisible: boolean,
  hasLocalVideo: boolean
) => {
  const width = useAnimatedValue(
    isChatVisible ? collapsedWidth : expandedAgentWidth
  );
  const height = useAnimatedValue(
    isChatVisible ? collapsedHeight : expandedAgentHeight
  );

  useEffect(() => {
    const widthAnim = Animated.spring(
      width,
      createAnimConfig(isChatVisible ? collapsedWidth : expandedAgentWidth)
    );
    const heightAnim = Animated.spring(
      height,
      createAnimConfig(isChatVisible ? collapsedHeight : expandedAgentHeight)
    );

    widthAnim.start();
    heightAnim.start();

    return () => {
      widthAnim.stop();
      heightAnim.stop();
    };
  }, [width, height, isChatVisible]);

  const x = useAnimatedValue(0);
  const y = useAnimatedValue(0);
  useEffect(() => {
    let targetX: number;
    let targetY: number;

    if (!isChatVisible) {
      targetX = 0;
      targetY = 0;
    } else {
      if (!hasLocalVideo) {
        targetX = 0.5 - collapsedWidth / 2;
        targetY = 16;
      } else {
        targetX = 0.32 - collapsedWidth / 2;
        targetY = 16;
      }
    }

    const xAnim = Animated.spring(x, createAnimConfig(targetX));
    const yAnim = Animated.spring(y, createAnimConfig(targetY));

    xAnim.start();
    yAnim.start();

    return () => {
      xAnim.stop();
      yAnim.stop();
    };
  }, [x, y, isChatVisible, hasLocalVideo]);

  return {
    left: x.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
    top: y,
    width: width.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
    height: height.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
  };
};

const useLocalVideoPosition = (
  isChatVisible: boolean,
  containerDimens: { width: number; height: number }
): ViewStyle => {
  const width = useAnimatedValue(
    isChatVisible ? collapsedWidth : expandedLocalWidth
  );
  const height = useAnimatedValue(
    isChatVisible ? collapsedHeight : expandedLocalHeight
  );

  useEffect(() => {
    const widthAnim = Animated.spring(
      width,
      createAnimConfig(isChatVisible ? collapsedWidth : expandedLocalWidth)
    );
    const heightAnim = Animated.spring(
      height,
      createAnimConfig(isChatVisible ? collapsedHeight : expandedLocalHeight)
    );

    widthAnim.start();
    heightAnim.start();

    return () => {
      widthAnim.stop();
      heightAnim.stop();
    };
  }, [width, height, isChatVisible]);

  const x = useAnimatedValue(0);
  const y = useAnimatedValue(0);
  useEffect(() => {
    let targetX: number;
    let targetY: number;

    if (!isChatVisible) {
      targetX = 1 - expandedLocalWidth - 16 / containerDimens.width;
      targetY = 1 - expandedLocalHeight - 106 / containerDimens.height;
    } else {
      targetX = 0.66 - collapsedWidth / 2;
      targetY = 0;
    }

    const xAnim = Animated.spring(x, createAnimConfig(targetX));
    const yAnim = Animated.spring(y, createAnimConfig(targetY));
    xAnim.start();
    yAnim.start();
    return () => {
      xAnim.stop();
      yAnim.stop();
    };
  }, [containerDimens.width, containerDimens.height, x, y, isChatVisible]);

  return {
    left: x.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
    top: y.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
    width: width.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
    height: height.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
    marginTop: 16,
  };
};
