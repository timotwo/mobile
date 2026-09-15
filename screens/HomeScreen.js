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
        colors={['#a0b27d', '#2f613e']}
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
          <Text style={styles.titulo}>MSC WOW</Text>
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

  header: { flex: 6, backgroundColor: '#2f613e' },

  titulo: { color: '#2bea81', fontSize: 28, fontWeight: '600', fontFamily: 'SpaceGrotesk_700Bold', textAlign: 'center', marginTop: 10, },

  subtitulo: { color: '#fff8f8', fontSize: 14, marginTop: 4, fontFamily: 'SpaceGrotesk_700Bold', textAlign: 'center', },

  configBotao: { width: '88%', bottom: 3, left: 3, right: 3, paddingHorizontal: 20, borderRadius: 13,
  paddingVertical: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#3d4951',

  alignSelf: 'center', gap: 10, marginTop: 78 },

  configTexto: { color: '#b0ffa4', fontSize: 14, fontFamily: 'SpaceGrotesk_700Bold', textAlign: 'center' },

  msc: { position: 'relative', flex: 19,  },

});