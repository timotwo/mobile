
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function ConfigScreen({ navigation }) {
  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Configurações
      </Text>

      

      <Pressable
        style={styles.botao}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.botaoTexto}>
          Voltar
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
  },

  titulo: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  botao: {
    marginTop: 30,
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 10,
  },

  botaoTexto: {
    color: 'white',
    fontSize: 16,
  },
});
