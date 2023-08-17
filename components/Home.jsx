import { View, Text, SafeAreaView, ActivityIndicator } from 'react-native'
import { BellIcon, UserIcon, HashtagIcon } from 'react-native-heroicons/solid'
import Nav from './Nav'
import SearchScreen from './SearchScreen'
import SearchResults from './SearchResults'
import { useState } from 'react'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'

const Home = () => {
    const [searchResults, setSearchResults] = useState([]);
    const navigation = useNavigation();
    const handleSearch = async (searchQuery) => {
        try {
            const response = await axios.get(`https://api.cricapi.com/v1/series?apikey=37d5d5e0-2e5b-430c-838f-5a51f4fc7632&offset=0&search=${searchQuery}`);
            if (!Array.isArray(response.data)) {
                console.error('Invalid response data format.');
                return;
            }
            const filteredResults = response.data.filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            setSearchResults(filteredResults);
            navigation.navigate('SearchResults', { searchResults: filteredResults })
            return filteredResults;
        } catch (error) {
            console.error(error);
        }
    };
    // if (searchResults.length === 0) {
    //     return <ActivityIndicator size={30} color=" blue" />
    // }
    return (
        <SafeAreaView className="bg-blue-500 flex-1 mb-3">
            <View className="mx-2 items-center justify-between flex-row mt-1">
                <View className="flex-row">
                    <BellIcon size={30} color="#fff" />
                    <Text className="text-5xl absolute -top-8 right-0.5">.</Text>
                </View>
                <UserIcon size={30} color="#fff" />
            </View>

            {/* Title */}
            <View className="items-center justify-center flex-row my-2">
                <HashtagIcon size={18} color="#fff" />
                <Text className="font-bold text-xl text-white">CricLive</Text>
            </View>

            {/* Navbar */}
            <View className="bg-gray-200 h-full">

                <View className="bg-gray-500 h-9 w-full py-2 px-4">
                    <SearchScreen
                        handleSearch={handleSearch}

                    />
                    {searchResults.length > 0 ? (
                        <SearchResults navigation={navigation} route={route} searchResults={searchResults} />
                    ) : ''}
                </View>
                <Nav />
            </View>
        </SafeAreaView>
    )
}

export default Home