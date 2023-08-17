import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import axios from 'axios';
import SearchResults from './SearchResults';
import { MagnifyingGlassIcon } from 'react-native-heroicons/solid';

const SearchScreen = ({ navigation, handleSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchQuery = async () => {
    try {
      if (searchQuery.trim() === '') {
        return;
      }
      const filteredResults = await handleSearch(searchQuery);
      setSearchQuery('');

      navigation.navigate('SearchResults', { searchResults: filteredResults });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <View className="flex-row space-x-2">
        <MagnifyingGlassIcon size={22} color="white" />
        <TextInput
          placeholder="Search here..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          onSubmitEditing={handleSearchQuery}
          className="text-white placeholder-white"
          placeholderTextColor="white"
        />
      </View>

      {searchQuery ? <SearchResults navigation={navigation} searchResults={searchResults} /> : ''}
    </View>
  );
};

export default SearchScreen;
