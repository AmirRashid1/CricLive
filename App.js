import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from './components/Home';

import { Live } from './components/Previews';
import SearchResults from './components/SearchResults';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen options={{ headerTitle: '', headerShown: false, headerStyle: { backgroundColor: 'blue' } }} name="Home" component={Home} />
        <Stack.Screen name="SearchResults" component={SearchResults} options={{ title: 'Search Results' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


