import React from 'react';
import { View, FlatList, Text } from 'react-native';

const SearchResults = ({ route }) => {
    const { searchResults } = route.params;

    return (
        <View className="bg-black items-center">
            <FlatList
                data={searchResults}
                renderItem={({ item }) => (
                    <View key={item.id}>
                        <Text>{item.name}</Text>
                        {/* <Text>{item.description}</Text> */}
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

export default SearchResults;
