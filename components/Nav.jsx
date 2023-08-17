
import { Text, SafeAreaView, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { All, Live, Upcoming, Finished, News } from './Previews';

const Tab = createMaterialTopTabNavigator();

const Nav = () => {
    return (
        <SafeAreaView style={{ flex: 1 }} className="mb-16">
            {/* <NavigationContainer> */}

            <Tab.Navigator tabBarOptions={{
                tabStyle: { width: 'auto' }, // Adjust the width as needed
                scrollEnabled: true,
            }}>
                <Tab.Screen name="All" component={All} />
                <Tab.Screen name="Live" component={Live} />
                <Tab.Screen name="Upcoming" component={Upcoming} />
                <Tab.Screen name="Finished" component={Finished} />
                <Tab.Screen name="News" component={News} />
            </Tab.Navigator>

            {/* </NavigationContainer> */}
        </SafeAreaView>
    );
};

export default Nav;
