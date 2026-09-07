import { PlayerProvider } from './contexts/PlayerContext';
import HomeScreen from './screens/HomeScreen';



export default function App() {
  return (
    <PlayerProvider>
      <HomeScreen />
    </PlayerProvider>
  );
}
