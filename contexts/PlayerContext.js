import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import * as MediaLibrary from 'expo-media-library/legacy';
import MusicInfo from 'expo-music-info-2';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DURACAO_MINIMA_SEGUNDOS = 48;
const PlayerContext = createContext(null);

function corrigirPictureData(pictureData) {
  if (!pictureData) return null;
  const match = pictureData.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/s);
  if (!match) return null;

  const mime = match[1];
  const base64 = match[2].replace(/\s/g, '');

  const binario = atob(base64);
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) {
    bytes[i] = binario.charCodeAt(i);
  }

  let inicio = -1;
  for (let i = 0; i < bytes.length - 3; i++) {
    if (bytes[i] === 0xff && bytes[i + 1] === 0xd8 && bytes[i + 2] === 0xff) {
      inicio = i;
      break;
    }
    if (bytes[i] === 0x89 && bytes[i + 1] === 0x50 && bytes[i + 2] === 0x4e && bytes[i + 3] === 0x47) {
      inicio = i;
      break;
    }
  }

  if (inicio === -1) return null;

  const bytesImagem = bytes.slice(inicio);
  let binarioImagem = '';
  for (let i = 0; i < bytesImagem.length; i++) {
    binarioImagem += String.fromCharCode(bytesImagem[i]);
  }

  return `data:${mime};base64,${btoa(binarioImagem)}`;
}

export function PlayerProvider({ children }) {
  const [musicas, setMusicas] = useState([]);
  const [filaAtual, setFilaAtual] = useState([]);
  const [indiceNaFila, setIndiceNaFila] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [capaAtual, setCapaAtual] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const jaAvancou = useRef(false);

  const musicaAtual = indiceNaFila !== null
    ? musicas.find((m) => m.id === filaAtual[indiceNaFila]) ?? null
    : null;

  function estaTocando(musicaId) {
    return musicaAtual?.id === musicaId;
  }

  useEffect(() => {
    carregarMusicas();
  }, []);

  useEffect(() => {
    carregarPlaylists();
  }, []);

  useEffect(() => {
    if (!musicaAtual || !status.duration) return;
    const terminou = status.currentTime > 0 && status.currentTime >= status.duration - 0.3;
    if (terminou && !jaAvancou.current) {
      jaAvancou.current = true;
      proximaMusica();
    }
    if (!terminou) jaAvancou.current = false;
  }, [status.currentTime, status.duration]);

  async function carregarMusicas() {
    setCarregando(true);
    let permissao = permissionResponse;
    if (!permissao?.granted) permissao = await requestPermission();
    if (!permissao.granted) { setCarregando(false); return; }

    let todasAsMusicas = [];
    let pagina = await MediaLibrary.getAssetsAsync({ mediaType: 'audio', first: 200 });
    todasAsMusicas = [...pagina.assets];

    while (pagina.hasNextPage) {
      pagina = await MediaLibrary.getAssetsAsync({ mediaType: 'audio', first: 200, after: pagina.endCursor });
      todasAsMusicas = [...todasAsMusicas, ...pagina.assets];
    }

    const formatadas = todasAsMusicas
      .filter((item) => (item.duration ?? 0) >= DURACAO_MINIMA_SEGUNDOS)
      .map((item) => ({ id: item.id, nome: item.filename.replace(/\.(mp3)$/i, ''), uri: item.uri }))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }));

    setMusicas(formatadas);
    setCarregando(false);
  }

  async function carregarPlaylists() {
    try {
      const salvas = await AsyncStorage.getItem('@playlists');
      if (salvas) setPlaylists(JSON.parse(salvas));
    } catch (e) {
      
    }
  }

  async function salvarPlaylists(novasPlaylists) {
    setPlaylists(novasPlaylists);
    try {
      await AsyncStorage.setItem('@playlists', JSON.stringify(novasPlaylists));
    } catch (e) {
      
    }
  }

  function criarPlaylist(nome) {
    if (!nome.trim()) return;
    salvarPlaylists([...playlists, { id: Date.now().toString(), nome: nome.trim(), musicas: [] }]);
  }

  function excluirPlaylist(playlistId) {
    salvarPlaylists(playlists.filter((p) => p.id !== playlistId));
  }

  function adicionarMusicasNaPlaylist(playlistId, idsMusicas) {
    salvarPlaylists(
      playlists.map((p) => {
        if (p.id !== playlistId) return p;
        return { ...p, musicas: [...p.musicas, ...idsMusicas.filter((id) => !p.musicas.includes(id))] };
      })
    );
  }

  function removerMusicaDaPlaylist(playlistId, musicaId) {
    salvarPlaylists(
      playlists.map((p) => {
        if (p.id !== playlistId) return p;
        return { ...p, musicas: p.musicas.filter((id) => id !== musicaId) };
      })
    );
  }

  async function buscarCapa(item) {
    try {
      const info = await MediaLibrary.getAssetInfoAsync(item.id);
      const uriParaLeitura = info.localUri || info.uri || item.uri;
      const metadata = await MusicInfo.getMusicInfoAsync(uriParaLeitura, { picture: true });
      const uriFinal = corrigirPictureData(metadata?.picture?.pictureData);
      setCapaAtual(uriFinal);
    } catch (e) {
      setCapaAtual(null);
    }
  }

  function tocarMusica(idMusica, fila = musicas.map((m) => m.id)) {
    const musica = musicas.find((m) => m.id === idMusica);
    if (!musica) return;

    const novoIndice = fila.indexOf(idMusica);
    setFilaAtual(fila);
    setIndiceNaFila(novoIndice);

    player.replace({ uri: musica.uri });
    player.play();
    buscarCapa(musica);
  }

  function alternarPlayPause(idMusica, fila) {
    if (musicaAtual?.id === idMusica) {
      status.playing ? player.pause() : player.play();
    } else {
      tocarMusica(idMusica, fila);
    }
  }

  function proximaMusica() {
    if (indiceNaFila === null || filaAtual.length === 0) return;
    const proximoIndice = (indiceNaFila + 1) % filaAtual.length;
    tocarMusica(filaAtual[proximoIndice], filaAtual);
  }

  function musicaAnterior() {
    if (indiceNaFila === null || filaAtual.length === 0) return;
    const anteriorIndice = (indiceNaFila - 1 + filaAtual.length) % filaAtual.length;
    tocarMusica(filaAtual[anteriorIndice], filaAtual);
  }

  return (
    <PlayerContext.Provider
      value={{
        musicas, musicaAtual, estaTocando, carregando, status, player, capaAtual,
        permissionResponse, carregarMusicas, tocarMusica,
        alternarPlayPause, proximaMusica, musicaAnterior,
        playlists, criarPlaylist, excluirPlaylist, adicionarMusicasNaPlaylist, removerMusicaDaPlaylist,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('erro');
  return ctx;
}