import { View, Text, Pressable, StyleSheet } from 'react-native';
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

      <View style={styles.ccontainer}>
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
            <Text style={styles.configTexto}>    🎵{'\n'}musicas</Text>
          </Pressable>
          <Pressable style={styles.configBotao} onPress={() => setAbaAtiva('playlist')}>
            <Text style={styles.configTexto}>    💽{'\n'}playlist</Text>
          </Pressable>
          <Pressable style={styles.configBotao} onPress={() => setAbaAtiva('config')}>
            <Text style={styles.configTexto}>    ⚙️{'\n'}config</Text>
          </Pressable>
        </View>

        <MiniPlayer onPress={() => setAbaAtiva('player')} />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: '#111' },

  ccontainer: { flex: 1, flexDirection: 'row', backgroundColor: '#111' },

  headerr: { backgroundColor: '#f2ecec', padding: 16, alignItems: 'center', justifyContent: 'center' },

  header: { flex: 0, backgroundColor: '#2a1a1a' },

  titulo: { color: '#ff0000', fontSize: 28, fontWeight: '600' },

  subtitulo: { color: '#777', fontSize: 14, marginTop: 4 },

  configBotao: { bottom: 0, left: 0, right: 0, paddingHorizontal: 20, borderRadius: 10,
  paddingVertical: 16, alignItems: 'center', backgroundColor: '#eedede',
  alignSelf: 'center', gap: 10, marginTop: 78 },

  configTexto: { color: '#888', fontSize: 13 },

  msc: { position: 'relative', flex: 19 },

});