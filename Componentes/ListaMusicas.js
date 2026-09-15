import { Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { usePlayer } from '../contexts/PlayerContext';

export default function ListaMusicas() {
  const {
    musicas,
    musicaAtual,
    estaTocando,
    alternarPlayPause,
    carregando,
    carregarMusicas,
    permissionResponse,
    status,
  } = usePlayer();

  const filaCompleta = musicas.map((m) => m.id);

  return (
    <>
      {!carregando && !permissionResponse?.granted && (
        <Pressable style={styles.permissaoBotao} onPress={carregarMusicas}>
          <Text style={styles.permissaoTexto}>Permitir acesso aos arquivos</Text>
        </Pressable>
      )}
      <FlatList
        data={musicas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: musicaAtual ? 100 : 20 }}
        renderItem={({ item }) => {
          const ativa = estaTocando(item.id);
          return (
            <Pressable
              style={styles.musica}
              onPress={() => alternarPlayPause(item.id, filaCompleta)}
            >
              <Text
                style={[styles.nomeMusica, ativa && styles.nomeMusicaAtiva]}
                numberOfLines={1}
              >
                {item.nome}
              </Text>
              <Text style={styles.iconePlay}>
                {ativa && status.playing ? '▐▐' : '▶'}
              </Text>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          !carregando && <Text style={styles.vazio}>nenhuma musica por aqui...</Text>
        }
      />
    </>
  );
}





const styles = StyleSheet.create({
  permissaoBotao: { marginHorizontal: 24, marginBottom: 16, paddingVertical: 14,
  borderRadius: 10, backgroundColor: '#1a1a1a', alignItems: 'center' },

  permissaoTexto: { color: '#fff', fontSize: 14 },

  musica: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  paddingVertical: 16, paddingHorizontal: 24,
  borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#222' },

  nomeMusica: { color: '#050505', fontSize: 15, flex: 1, marginRight: 12, fontFamily: 'SpaceGrotesk_700Bold',},

  nomeMusicaAtiva: {  fontFamily: 'SpaceGrotesk_700Bold',  },

  iconePlay: { color: '#b7f69a', fontSize: 14 },
  
  vazio: { color: '#666', fontSize: 14, textAlign: 'center', marginTop: 40 },
});