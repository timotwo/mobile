import { View, Text, Pressable, StyleSheet } from 'react-native';


export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>Minhas Músicas</Text>

      <View style={styles.musica}>
        <Text style={styles.nomeMusica}>Minha Música</Text>
        <Text style={styles.artista}>Artista desconhecido</Text>

        <Pressable style={styles.botao}>
          <Text style={styles.botaoTexto}>▶ Tocar</Text>
        </Pressable>
      </View>

      <View style={styles.musica}>
        <Text style={styles.nomeMusica}>Outra Música</Text>
        <Text style={styles.artista}>Artista desconhecido</Text>

        <Pressable style={styles.botao}>
          <Text style={styles.botaoTexto}>▶ Tocar</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.configBotao}
        onPress={() => navigation.navigate('ConfigScreen1')}
      >
        <Text style={styles.configTexto}>⚙ Configurações</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
  },

  titulo: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 30,
  },

  musica: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },

  nomeMusica: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  artista: {
    color: '#aaa',
    fontSize: 15,
    marginTop: 5,
    marginBottom: 15,
  },

  botao: {
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  botaoTexto: {
    color: 'white',
    fontSize: 16,
  },

  configBotao: {
    marginTop: 'auto',
    padding: 15,
    alignItems: 'center',
  },

  configTexto: {
    color: '#aaa',
    fontSize: 16,
  },
});

