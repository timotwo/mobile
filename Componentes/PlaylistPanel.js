import { View, Text, Pressable, TextInput, FlatList, StyleSheet } from 'react-native';
import { useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';

export default function PlaylistPanel() {
  const {
    musicas,
    status,
    estaTocando,
    alternarPlayPause,
    playlists,
    criarPlaylist,
    excluirPlaylist,
    adicionarMusicasNaPlaylist,
    removerMusicaDaPlaylist,
  } = usePlayer();

  const [nome, setNome] = useState('');
  const [criando, setCriando] = useState(false);
  const [playlistSelecionadaId, setPlaylistSelecionadaId] = useState(null);
  const [adicionandoMusicas, setAdicionandoMusicas] = useState(false);
  const [musicasSelecionadas, setMusicasSelecionadas] = useState([]);

  const playlistSelecionada = playlists.find((p) => p.id === playlistSelecionadaId) ?? null;

  function handleCriarPlaylist() {
    criarPlaylist(nome);
    setNome('');
    setCriando(false);
  }

  function alternarMusica(id) {
    setMusicasSelecionadas((anteriores) =>
      anteriores.includes(id) ? anteriores.filter((musicaId) => musicaId !== id) : [...anteriores, id]
    );
  }

  function handleAdicionarMusicas() {
    adicionarMusicasNaPlaylist(playlistSelecionadaId, musicasSelecionadas);
    setMusicasSelecionadas([]);
    setAdicionandoMusicas(false);
  }

  
  if (playlistSelecionada && adicionandoMusicas) {
    return (
      <View style={styles.container}>
        <Pressable style={styles.voltar} onPress={() => { setAdicionandoMusicas(false); setMusicasSelecionadas([]); }}>
          <Text style={styles.voltarTexto}>← Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Adicionar músicas</Text>

        <Pressable style={styles.botao} onPress={handleAdicionarMusicas}>
          <Text style={styles.botaoTexto}>Adicionar selecionadas</Text>
        </Pressable>

        <Text style={styles.subtitulo}>{musicasSelecionadas.length} selecionada(s)</Text>

        <FlatList
          data={musicas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const selecionada = musicasSelecionadas.includes(item.id);
            return (
              <Pressable
                style={[styles.musica, selecionada && styles.musicaSelecionada]}
                onPress={() => alternarMusica(item.id)}
              >
                <Text style={styles.nomeMusica} numberOfLines={1}>{item.nome}</Text>
                <Text style={styles.checkbox}>{selecionada ? '✓' : '○'}</Text>
              </Pressable>
            );
          }}
        />
      </View>
    );
  }


  if (playlistSelecionada) {
    const musicasDaPlaylist = musicas.filter((musica) => playlistSelecionada.musicas.includes(musica.id));
    const filaDaPlaylist = musicasDaPlaylist.map((m) => m.id);

    return (
      <View style={styles.container}>
        <Pressable style={styles.voltar} onPress={() => setPlaylistSelecionadaId(null)}>
          <Text style={styles.voltarTexto}>← Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>{playlistSelecionada.nome}</Text>

        <Pressable style={styles.botao} onPress={() => { setMusicasSelecionadas([]); setAdicionandoMusicas(true); }}>
          <Text style={styles.botaoTexto}>+ Adicionar músicas</Text>
        </Pressable>

        {musicasDaPlaylist.length === 0 ? (
          <Text style={styles.vazio}>Nenhuma música nesta playlist.</Text>
        ) : (
          <FlatList
            data={musicasDaPlaylist}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const tocando = estaTocando(item.id) && status.playing;

              return (
                <Pressable style={styles.musica} onPress={() => alternarPlayPause(item.id, filaDaPlaylist)}>
                  <Text style={[styles.nomeMusica, tocando && styles.nomeMusicaTocando]} numberOfLines={1}>
                    {item.nome}
                  </Text>
                  <Pressable onPress={() => removerMusicaDaPlaylist(playlistSelecionada.id, item.id)} hitSlop={10}>
                    <Text style={styles.remover}>✕</Text>
                  </Pressable>
                  <Text style={styles.iconePlay}>{tocando ? '▐▐' : '▶'}</Text>
                </Pressable>
              );
            }}
          />
        )}
      </View>
    );
  }

  
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Playlists</Text>

      <Pressable style={styles.botao} onPress={() => setCriando(true)}>
        <Text style={styles.botaoTexto}>+ Nova playlist</Text>
      </Pressable>

      {criando && (
        <View style={styles.criacao}>
          <TextInput
            style={styles.input}
            placeholder="Nome da playlist"
            placeholderTextColor="#666"
            value={nome}
            onChangeText={setNome}
            autoFocus
          />
          <Pressable style={styles.botaoCriar} onPress={handleCriarPlaylist}>
            <Text style={styles.botaoTexto}>Criar</Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.playlist}>
            <Pressable style={styles.botaoPlaylist} onPress={() => setPlaylistSelecionadaId(item.id)}>
              <Text style={styles.nomePlaylist}>{item.nome}</Text>
              <Text style={styles.quantidade}>{item.musicas.length} música(s)</Text>
            </Pressable>
            <Pressable onPress={() => excluirPlaylist(item.id)} hitSlop={10}>
              <Text style={styles.remover}>✕</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={!criando && <Text style={styles.vazio}>Nenhuma playlist criada ainda.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  titulo: { color: '#fff', fontSize: 24, fontWeight: '600', marginBottom: 15 },

  subtitulo: { color: '#888', marginBottom: 10 },

  botao: { backgroundColor: '#2a1a1a', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },

  botaoCriar: { backgroundColor: '#2a1a1a', padding: 15, borderRadius: 10, alignItems: 'center' },

  botaoPlaylist: { flex: 1, padding: 5 },

  botaoTexto: { color: '#fff', fontSize: 14 },

  criacao: { marginBottom: 20 },

  input: { backgroundColor: '#222', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 10 },


  playlist: {
    backgroundColor: '#1b1b1b', padding: 18, borderRadius: 10, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },

  nomePlaylist: { color: '#fff', fontSize: 16 },

  quantidade: { color: '#777', fontSize: 12, marginTop: 5 },

  vazio: { color: '#888', fontSize: 14 },

  voltar: { marginBottom: 20 },

  voltarTexto: { color: '#fff', fontSize: 16 },

  musica: {
    backgroundColor: '#1b1b1b', padding: 16, borderRadius: 10, marginBottom: 8,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },

  musicaSelecionada: { borderWidth: 1, borderColor: '#fff' },

  nomeMusica: { color: '#fff', fontSize: 15, flex: 1 },

  nomeMusicaTocando: { fontWeight: 'bold' },

  checkbox: { color: '#fff', fontSize: 24, marginLeft: 10 },

  iconePlay: { color: '#fff', fontSize: 18, marginLeft: 10 },

  remover: { color: '#888', fontSize: 16, marginLeft: 10 },
  
});