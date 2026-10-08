import { View, Text, Pressable, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { usePlayer } from '../contexts/PlayerContext';



export default function MiniPlayer({ onPress }) {
  const { musicaAtual, status, player, proximaMusica, musicaAnterior, alternarPlayPause } = usePlayer();

  if (!musicaAtual) return null;

  return (
    <Pressable style={styles.player} onPress={onPress}>
      <Text style={styles.playerNome} numberOfLines={1}>{musicaAtual.nome}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={status.duration || 1}
        value={status.currentTime}
        minimumTrackTintColor="#86bd5c"
        maximumTrackTintColor="rgb(196, 255, 240)"
        thumbTintColor="#f8f7f7"
        onSlidingComplete={(v) => player.seekTo(v)}
      />
      <View style={styles.playerLinha}>
        <View style={styles.playerControles}>
          <Pressable onPress={musicaAnterior} style={{ marginLeft: 20 }}>
            <Text style={styles.playerIcone}>⏮</Text>
          </Pressable>
          <Pressable onPress={() => alternarPlayPause(musicaAtual.id)} style={{ marginLeft: 20 }}>
            <Text style={styles.playerIcone}>{status.playing ? '▐▐' : '▶'}</Text>
          </Pressable>
          <Pressable onPress={proximaMusica} style={{ marginLeft: 20 }}>
            <Text style={styles.playerIcone}>⏭</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  player: { width: '90%', position: 'absolute', bottom: 60, left: 21, right: 0,
  backgroundColor: '#3d4951', paddingHorizontal: 50, paddingTop: 10,
  borderRadius: 24, paddingBottom: 18,
  },

  slider: { width: '100%', height: 24, marginBottom: 4 },

  playerLinha: { flexDirection: 'row', marginTop: 6 },

  playerNome: { color: '#fff', fontSize: 14, flex: 1, marginRight: 12, fontFamily: 'SpaceGrotesk_700Bold', },

  playerControles: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center' },
  
  playerIcone: { color: '#fff', fontSize: 20, fontFamily: 'SpaceGrotesk_700Bold',},
});




