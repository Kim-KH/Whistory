import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FontScaleProvider } from './content/useFontScale';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import TopicListScreen from './screens/TopicListScreen';
import TopicDetailScreen from './screens/TopicDetailScreen';
import QuizHomeScreen from './screens/QuizHomeScreen';
import QuizScreen from './screens/QuizScreen';
import QuizResultScreen from './screens/QuizResultScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <FontScaleProvider>
        <StatusBar style="dark" />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="TopicList" component={TopicListScreen} />
            <Stack.Screen name="TopicDetail" component={TopicDetailScreen} />
            <Stack.Screen name="QuizHome" component={QuizHomeScreen} />
            <Stack.Screen name="Quiz" component={QuizScreen} />
            <Stack.Screen name="QuizResult" component={QuizResultScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </FontScaleProvider>
    </SafeAreaProvider>
  );
}
