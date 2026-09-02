import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import Slider from '@react-native-community/slider';
import * as MediaLibrary from 'expo-media-library/legacy';

const DURACAO_MINIMA_SEGUNDOS = 30;

export default function HomeScreen({ navigation }) {

  const [musicas, setMusicas] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const jaAvancou = useRef(false);

  const musicaAtual = indiceAtual !== null ? musicas[indiceAtual] : null;

  useEffect(() => {
    carregarMusicas();
  }, []);

 
  useEffect(() => {
    if (!musicaAtual || !status.duration) return;

    const terminou = status.currentTime > 0 && status.currentTime >= status.duration - 0.3;

    if (terminou && !jaAvancou.current) {
      jaAvancou.current = true;
      proximaMusica();
    }

    if (!terminou) {
      jaAvancou.current = false;
    }
  }, [status.currentTime, status.duration]);

  async function carregarMusicas() {
    setCarregando(true);

    let permissao = permissionResponse;
    if (!permissao?.granted) {
      permissao = await requestPermission();
    }

    if (!permissao.granted) {
      setCarregando(false);
      return;
    }

    let todasAsMusicas = [];
    let pagina = await MediaLibrary.getAssetsAsync({ mediaType: 'audio', first: 200 });
    todasAsMusicas = [...pagina.assets];

    while (pagina.hasNextPage) {
      pagina = await MediaLibrary.getAssetsAsync({
        mediaType: 'audio',
        first: 200,
        after: pagina.endCursor,
      });
      todasAsMusicas = [...todasAsMusicas, ...pagina.assets];
    }

    const formatadas = todasAsMusicas
      
      .filter((item) => (item.duration ?? 0) >= DURACAO_MINIMA_SEGUNDOS)
      .map((item) => ({
        id: item.id,
        nome: item.filename.replace(/\.(mp3)$/i, ''),
        uri: item.uri,
      }))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }));

    setMusicas(formatadas);
    setCarregando(false);
  }

  function tocarMusica(index) {
    player.replace({ uri: musicas[index].uri });
    player.play();
    setIndiceAtual(index);
  }

  function alternarPlayPause(index) {
    if (indiceAtual === index) {
      status.playing ? player.pause() : player.play();
    } else {
      tocarMusica(index);
    }
  }

  function proximaMusica() {
    if (indiceAtual === null || musicas.length === 0) return;
    const proximo = (indiceAtual + 1) % musicas.length;
    tocarMusica(proximo);
  }
  function musicaAnterior() {
    if (indiceAtual === null || musicas.length === 0) return;
    const proximo = (indiceAtual - 1 + musicas.length) % musicas.length;
    tocarMusica(proximo);
  }

  return (


















  <View style={styles.container}>

    <View style={styles.headerr}>
      <Text>
        ddfvksd
      </Text>
    </View>

    
    <View style={styles.ccontainer}>
      

          {!carregando && !permissionResponse?.granted && (
            <Pressable style={styles.permissaoBotao} onPress={carregarMusicas}>
              <Text style={styles.permissaoTexto}>Permitir acesso aos arquivos</Text>
            </Pressable>
          )}

          

          


          
          <View style={styles.msc}>
            <FlatList
              data={musicas}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: musicaAtual ? 100 : 20 }}
              renderItem={({ item, index }) => {
                const ativa = indiceAtual === index;
                return (
                  <Pressable
                    style={styles.musica}
                    onPress={() => alternarPlayPause(index)}
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
                !carregando && (
                  <Text style={styles.vazio}>nenhumaa musica por aqui...</Text>
                )
              }
            />
          </View>



          <View style={styles.header}>
            <Text style={styles.titulo}>Msc</Text>
            <Text style={styles.subtitulo}>
              {carregando ? 'Carregando...' : `${musicas.length} musicas`}
            </Text>

            <Pressable style={styles.configBotao} onPress={() => navigation.navigate('Config')}>
              <Text style={styles.configTexto}>Conf</Text>
            </Pressable>

            <Pressable style={styles.configBotao} onPress={() => navigation.navigate('Config')}>
              <Text>Pl</Text>
            </Pressable>

            <Pressable style={styles.configBotao} onPress={() => navigation.navigate('Config')}>
              <Text>Pe</Text>
            </Pressable>

            <Pressable style={styles.configBotao} onPress={() => navigation.navigate('Config')}>
              <Text>Co</Text>
            </Pressable>

          </View>


          {musicaAtual && (
            <View style={styles.player}>

              <Text style={styles.playerNome} numberOfLines={1}>
                {musicaAtual.nome}
              </Text>


              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={status.duration || 1}
                value={status.currentTime}
                minimumTrackTintColor="#fff"
                maximumTrackTintColor="#444"
                thumbTintColor="#fff"
                onSlidingComplete={(valor) => player.seekTo(valor)}
              />

              <View style={styles.playerLinha}>
                

                <View style={styles.playerControles}>

                  <Pressable onPress={musicaAnterior} style={{ marginLeft: 20 }}>
                    <Text style={styles.playerIcone}>⏮</Text>
                  </Pressable>





                  <Pressable onPress={() => alternarPlayPause(indiceAtual)} style={{ marginLeft: 20 }}>
                    <Text style={styles.playerIcone}>
                      {status.playing ? '▐▐' : '▶'}
                    </Text>
                  </Pressable>

                  
                  <Pressable onPress={proximaMusica} style={{ marginLeft: 20 }}>
                    <Text style={styles.playerIcone}>⏭</Text>
                  </Pressable>
                </View>

              </View>

            </View>
          )}

        





    </View>

  </View>










  );
}











const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  ccontainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#111',
  },
  headerr: {
    backgroundColor: '#f2ecec',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },


  header: {
    flex: 0,
    backgroundColor: '#2a1a1a',
  },

  titulo: {
    color: '#ff0000',
    fontSize: 28,
    fontWeight: '600',
  },

  subtitulo: {
    color: '#777',
    fontSize: 14,
    marginTop: 4,
  },

  permissaoBotao: {
    marginHorizontal: 24,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },

  permissaoTexto: {
    color: '#fff',
    fontSize: 14,
  },

  musica: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#222',
  },

  nomeMusica: {
    color: '#ccc',
    fontSize: 15,
    flex: 1,
    marginRight: 12,
  },

  nomeMusicaAtiva: {
    color: '#a3a3a3',
    fontWeight: '600',
  },

  iconePlay: {
    color: '#888',
    fontSize: 14,
  },

  vazio: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 40,
  },

  player: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    backgroundColor: '#161616',
    paddingHorizontal: 50,
    paddingTop: 10,
    borderRadius: 40,
    paddingBottom: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#2a2a2a',
  },

  slider: {
    width: '100%',
    height: 24,
    marginBottom: 4,
  },

  playerLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  playerNome: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    marginRight: 12,
  },

  playerControles: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    
  },

  playerIcone: {
    color: '#fff',
    fontSize: 20,
  },

  configBotao: {
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#eedede',
    alignSelf: 'center',
    gap: 10,
    marginTop: 78,
  },

  configTexto: {
    color: '#888',
    fontSize: 13,
  },
  msc: {
    position: 'relative',
    flex: 19,
  },
  

});