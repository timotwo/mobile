import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { usePlayer } from '../contexts/PlayerContext';

export default function PlayerPanel() {
  const { musicaAtual, capaAtual, status, player, indiceAtual, proximaMusica, musicaAnterior, alternarPlayPause } = usePlayer();

  if (!musicaAtual) {
    return (
      <View style={styles.container}>
        <Text style={styles.nome}>Nenhuma música tocando</Text>
      </View>
    );
  }
  function formatarTempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = Math.floor(segundos % 60);

    return `${minutos}:${segundosRestantes.toString().padStart(2, '0')}`;
  }

  return (
    <View style={styles.container}>
      {capaAtual ? (
        <Image source={{ uri: capaAtual }} style={styles.capa} />
      ) : (
        <View style={[styles.capa, styles.capaVazia]} />
      )}

      <Text style={styles.nome} numberOfLines={2}>{musicaAtual.nome}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={status.duration || 1}
        value={status.currentTime}
        minimumTrackTintColor="#fff"
        maximumTrackTintColor="#444"
        thumbTintColor="#fff"
        onSlidingComplete={(v) => player.seekTo(v)}
      />
      <View style={styles.tempos}>
        <Text style={styles.tempo}>
          {formatarTempo(status.currentTime)}
        </Text>

        <Text style={styles.tempo}>
          {formatarTempo(status.duration)}
        </Text>
      </View>
      <View style={styles.controles}>
        <Pressable onPress={musicaAnterior}><Text style={styles.icone}>⏮</Text></Pressable>
        <Pressable onPress={() => alternarPlayPause(indiceAtual)}>
          <Text style={styles.icone}>{status.playing ? '▐▐' : '▶'}</Text>
        </Pressable>
        <Pressable onPress={proximaMusica}><Text style={styles.icone}>⏭</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 24,  justifyContent: 'center', },

  capa: { width: 220, height: 220, borderRadius: 16, alignSelf: 'center', marginBottom: 24, },

  capaVazia: { backgroundColor: '#df3a3a',},

  nome: {  color: '#fff',  fontSize: 20,  fontWeight: '600',  textAlign: 'center', marginBottom: 24, },

  slider: {  width: '100%',  height: 24,  marginBottom: 24,  },

  controles: {  flexDirection: 'row',  justifyContent: 'center',  gap: 40,},


  icone: {  color: '#fff',  fontSize: 32, },

  tempos: {flexDirection: 'row', justifyContent: 'space-between', width: '100%',
  },  

  tempo: { color: '#888', fontSize: 12, },
});