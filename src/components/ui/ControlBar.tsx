import { TrackReference, useLocalParticipant } from '@livekit/components-react';
import { BarVisualizer } from '@livekit/react-native';
import { useEffect, useState } from 'react';
import {
  ViewStyle,
  StyleSheet,
  View,
  TouchableOpacity,
  StyleProp,
  Text,
} from 'react-native';

type ControlBarProps = {
  style?: StyleProp<ViewStyle>;
  options: ControlBarOptions;
};

type ControlBarOptions = {
  isMicEnabled: boolean;
  onMicClick: () => void;
  isCameraEnabled: boolean;
  onCameraClick: () => void;
  isScreenShareEnabled: boolean;
  onScreenShareClick: () => void;
  isChatEnabled: boolean;
  onChatClick: () => void;
  onExitClick: () => void;
};

export default function ControlBar({ style = {}, options }: ControlBarProps) {
  const { microphoneTrack, localParticipant } = useLocalParticipant();
  const [trackRef, setTrackRef] = useState<TrackReference | undefined>(
    undefined
  );

  useEffect(() => {
    if (microphoneTrack) {
      setTrackRef({
        participant: localParticipant,
        publication: microphoneTrack,
        source: microphoneTrack.source,
      });
      console.log('🎤 Microphone track available:', microphoneTrack.sid);
    } else {
      setTrackRef(undefined);
      console.log('🔇 No microphone track');
    }
  }, [microphoneTrack, localParticipant]);

  // Log mic state changes
  useEffect(() => {
    console.log('🎤 Microphone state:', options.isMicEnabled ? 'ENABLED' : 'DISABLED');
  }, [options.isMicEnabled]);

  const handleMicClick = () => {
    console.log('🎤 Microphone button clicked, current state:', options.isMicEnabled ? 'enabled' : 'disabled');
    options.onMicClick();
  };

  return (
    <View style={[style, styles.container]}>
      <TouchableOpacity
        style={[
          styles.button,
          options.isMicEnabled ? styles.enabledButton : undefined,
        ]}
        activeOpacity={0.7}
        onPress={handleMicClick}
      >
        <Text style={styles.icon}>{options.isMicEnabled ? '🎤' : '🔇'}</Text>
        <BarVisualizer
          barCount={3}
          trackRef={trackRef}
          style={styles.micVisualizer}
          options={{
            minHeight: 0.1,
            barColor: '#CCCCCC',
            barWidth: 2,
          }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          options.isCameraEnabled ? styles.enabledButton : undefined,
        ]}
        activeOpacity={0.7}
        onPress={() => {
          console.log('📹 Camera button clicked');
          options.onCameraClick();
        }}
      >
        <Text style={styles.icon}>{options.isCameraEnabled ? '📹' : '📷'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          options.isChatEnabled ? styles.enabledButton : undefined,
        ]}
        activeOpacity={0.7}
        onPress={() => {
          console.log('💬 Chat button clicked');
          options.onChatClick();
        }}
      >
        <Text style={styles.icon}>💬</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.7}
        onPress={() => {
          console.log('📞 Exit button clicked');
          options.onExitClick();
        }}
      >
        <Text style={styles.icon}>📞</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingHorizontal: 8,
    backgroundColor: '#070707',
    borderColor: '#202020',
    borderRadius: 53,
    borderWidth: 1,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    padding: 10,
    marginHorizontal: 4,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enabledButton: {
    backgroundColor: '#131313',
  },
  icon: {
    fontSize: 20,
  },
  micVisualizer: {
    width: 20,
    height: 20,
  },
});
