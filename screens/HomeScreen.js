import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import ListaMusicas from '../Componentes/ListaMusicas';
import ConfigPanel from '../Componentes/ConfigPanel';
import PlayerPanel from '../Componentes/PlayerPanel';
import MiniPlayer from '../Componentes/MiniPlayer';
import PlaylistsPanel from '../Componentes/PlaylistPanel';

export default function HomeScreen() {
  const { musicas, carregando } = usePlayer();
  const [abaAtiva, setAbaAtiva] = useState('lista'); 

  return (
    <View style={styles.container}>
      <View style={styles.headerr}>
        <Text>timoteo                           timoteo    </Text>
      </View>

      <LinearGradient
        colors={['#1b364e', '#0f1437']}
        start=  {{ x: 0, y: 0 }}
        end={{x: 0.7, y: 0}}
        style={styles.ccontainer}
      >
        <View style={styles.msc}>
          {abaAtiva === 'lista' && <ListaMusicas />}
          {abaAtiva === 'config' && <ConfigPanel />}
          {abaAtiva === 'player' && <PlayerPanel />}
          {abaAtiva === 'playlist' && <PlaylistsPanel />}
          
        </View>

        <View style={styles.header}>
          <Text style={styles.titulo}>Msc</Text>
          <Text style={styles.subtitulo}>
            {carregando ? 'Carregando...' : `${musicas.length} musicas`}
          </Text>

          <Pressable style={styles.configBotao} onPress={() => setAbaAtiva('lista')}>
            <Text style={styles.configTexto}>🎵{'\n'}musicas</Text>
          </Pressable>
          <Pressable style={styles.configBotao} onPress={() => setAbaAtiva('playlist')}>
            <Text style={styles.configTexto}>💽{'\n'}playlist</Text>
          </Pressable>
          <Pressable style={styles.configBotao} onPress={() => setAbaAtiva('config')}>
            <Text style={styles.configTexto}>⚙️{'\n'}config</Text>
          </Pressable>
        </View>

        <MiniPlayer onPress={() => setAbaAtiva('player')} />
      </LinearGradient>
    </View>
  );
}


const styles = StyleSheet.create({

  container: { flex: 1, },

  ccontainer: { flex: 1, flexDirection: 'row', },

  headerr: { backgroundColor: '#f2ecec', padding: 16, alignItems: 'center', justifyContent: 'center' },

  header: { flex: 0, backgroundColor: '#0f1437' },

  titulo: { color: '#ff0000', fontSize: 28, fontWeight: '600', fontFamily: 'SpaceGrotesk_700Bold', },

  subtitulo: { color: '#fff8f8', fontSize: 14, marginTop: 4, fontFamily: 'SpaceGrotesk_700Bold',},

  configBotao: { bottom: 0, left: 0, right: 0, paddingHorizontal: 20, borderRadius: 10,
  paddingVertical: 16, alignItems: 'center', backgroundColor: '#053326',
  alignSelf: 'center', gap: 10, marginTop: 78 },

  configTexto: { color: '#58ce87', fontSize: 14, fontFamily: 'SpaceGrotesk_700Bold', textAlign: 'center' },

  msc: { position: 'relative', flex: 19,  },

});