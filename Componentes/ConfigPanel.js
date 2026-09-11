import { View, Text, StyleSheet } from 'react-native';
import { usePlayer } from '../contexts/PlayerContext';

export default function ConfigScreen() {
  const { musicas } = usePlayer();

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Configurações</Text>
      <Text style={styles.subtexto}> wfefwdvwsdv</Text>
    </View>
  );
}

const styles = StyleSheet.create({

  container: { flex: 1, },

  texto: {color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 20, },

  subtexto: { color: '#fff', fontSize: 16, textAlign: 'center', marginTop: 10,},
});