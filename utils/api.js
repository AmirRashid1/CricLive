import axios from 'axios';
const API_UPCOMMING_KEY = 'a241bc33-f3d9-42b6-aecf-cbe09f616c94';
const API_FINISHED_KEY = '68ca430b-ed11-4f6d-88a9-cb89a6ea0294';
const API_LIVE_KEY = 'c844f2a2-87c6-483a-b381-b3dc664f5f29'
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_DURATION = 100000; // 10 minutes in milliseconds //it will update api every 10 minutes

const fetchDataWithCaching = async (url, cacheKey, filterBy) => {
    try {
        const cachedData = await AsyncStorage.getItem(cacheKey);
        let lastModified = await AsyncStorage.getItem(`${cacheKey}_lastModified`);

        if (cachedData && lastModified) {
            const parsedData = JSON.parse(cachedData);
            const currentTime = new Date().getTime();

            if (currentTime - Number(lastModified) < CACHE_DURATION) {
                if (filterBy) {
                    const filteredData = parsedData.filter((item) => item.ms === filterBy);
                    return sortMatchesByDate(filteredData);
                }
                return sortMatchesByDate(parsedData);
            }
        }

        const response = await axios.get(url, {
            headers: {
                'If-Modified-Since': lastModified || new Date(0).toUTCString()
            }
        });

        if (response.status === 304) {
            return sortMatchesByDate(JSON.parse(cachedData));
        }

        const data = response.data.data;

        await AsyncStorage.setItem(cacheKey, JSON.stringify(data));

        // Only store lastModified if the response is valid
        if (response.status === 200) {
            await AsyncStorage.setItem(`${cacheKey}_lastModified`, new Date().getTime().toString());
        }

        if (filterBy) {
            const filteredData = data.filter((item) => item.ms === filterBy);
            return sortMatchesByDate(filteredData);
        }

        return sortMatchesByDate(data);
    } catch (error) {
        console.error(error);
        return [];
    }
};

const sortMatchesByDate = (matches) => {
    return matches.sort((a, b) => new Date(a.dateTimeGMT) - new Date(b.dateTimeGMT));
};



export const upcommingMatches = async () => {
    const url = `https://api.cricapi.com/v1/cricScore?apikey=${API_UPCOMMING_KEY}`;
    const cacheKey = 'upcomingMatches';

    return fetchDataWithCaching(url, cacheKey, 'fixture');
};

export const finishedMatches = async () => {
    const url = `https://api.cricapi.com/v1/cricscore?apikey=${API_FINISHED_KEY}`;
    const cacheKey = 'finishedMatches';

    return fetchDataWithCaching(url, cacheKey, 'result');
};


export const fetchLiveMatches = async () => {
    try {
        const response = await axios.get(
            `https://api.cricapi.com/v1/cricScore?apikey=${API_LIVE_KEY}`
        );
        const liveMatches = response.data.data.filter(
            (matchData) => matchData.ms === 'live'
        );
        return liveMatches;
    } catch (error) {
        console.error(error);
        return [];
    }
};