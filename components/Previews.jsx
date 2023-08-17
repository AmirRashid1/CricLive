import { View, Text, SafeAreaView, Image, FlatList, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { EyeIcon } from 'react-native-heroicons/solid'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native';
import { fetchLiveMatches, upcommingMatches, finishedMatches } from '../utils/api';

export const All = () => {
    const navigation = useNavigation();
    const [liveMatches, setLiveMatches] = useState([])

    useEffect(() => {   //getting data from api.jsx then we use for see line number: (33)
        const fetchData = async () => {
            const liveMatchesData = await fetchLiveMatches();
            setLiveMatches(liveMatchesData)
        }
        fetchData();
    }, []);

    const renderViewMoreButton = (section) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate(section)}
                className="items-center justify-center  -top-4 rounded-lg bg-gray-500 w-28 py-2 px-1 mx-auto"
            >
                <Text className="text-white font-bold">View More</Text>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView className="px-2 mb-16" showsVerticalScrollIndicator={false}>

            {liveMatches.length > 0 ?
                <>
                    <Text className="font-bold mx-2 mt-6">Live Matches</Text>
                    <Live limit={3} />
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Live')}
                        className="items-center justify-center -top-4 rounded-lg bg-gray-500 w-28 py-2 px-1 mx-auto"
                    >
                        <Text className="text-white font-bold">View More</Text>
                    </TouchableOpacity>
                </> :

                <View className="items-center my-6">
                    <Text className="font-semibold text-gray-600 mx-3">No live matches available at the moment.</Text>
                </View>
            }

            <Text className=" font-bold mx-2 mt-6">Upcomming Matches</Text>
            <Upcoming limit={3} />
            {renderViewMoreButton('Upcoming')}


            <Text className=" font-bold mx-2 mt-6">Finished Matches</Text>
            <Finished limit={3} />
            {renderViewMoreButton('Finished')}
        </ScrollView>
    );
};

export const Live = ({ limit }) => {
    const [matchesData, setMatchesData] = useState([]);
    const [refreshing, setRefreshing] = useState(false); // for refresh our page
    useEffect(() => {
        const fetchData = async () => {
            const liveMatches = await fetchLiveMatches(); // Use the API function
            setMatchesData(liveMatches.slice(0, limit));
        };
        fetchData();
    }, []);
    const renderStatus = (status) => {
        if (status.includes('opt to bat')) {
            return 'Yet to bat';
        } else if (status.includes('Innings Break')) {
            return 'Innings Break';
        } else if (status.includes('Match not started')) {
            return '-';
        } else if (status.includes('Match delayed')) {
            return 'Match delayed';
        } else if (status.includes('Stumps')) {
            return 'Stumps';
        } else if (status.includes('opt to bowl')) {
            return 'Opt to bowl';
        }
        return status;
    };

    // const extractAbbreviation = (name) => {          //This is only used for to remove abbreviation e.g; if we have team like India [IND] it will show only IND
    //     if (name && name.includes('[')) {
    //         const splitName = name.split('[');
    //         return splitName[1].slice(0, -1);
    //     }
    //     return '';
    // };
    if (matchesData.length === 0) {
        // Data is not loaded yet, show loading message or loader here
        return (
            <View className="items-center m-auto">
                <ActivityIndicator size={55} color="blue" />
            </View>
        );
    }

    // it will refresh our page
    const handleRefresh = async () => {
        setRefreshing(true); // Start the refreshing indicator
        const liveMatches = await fetchLiveMatches(); // Fetch new live match data
        setMatchesData(liveMatches.slice(0, limit));
        setRefreshing(false); // End the refreshing indicator
    };


    // if (matchesData != 'live') {
    //     // No live matches available, display a message
    //     return (
    // <View className="items-center m-auto py-2">
    //     <Text className="font-semibold text-gray-600 mx-3">No live matches available at the moment.</Text>
    // </View>
    //     );
    // }

    return (
        <SafeAreaView className="mx-3 h-auto">
            <FlatList data={matchesData} renderItem={({ item }) => (
                <View className="mt-3 bg-white rounded-2xl  pb-4">
                    <View className="pt-3  px-5 space-y-2 ">
                        <View className="flex-row items-center justify-between ">
                            <View className="flex-row items-center mx-auto justify-center space-x-1 bg-slate-300 rounded-md p-1 opacity-60">
                                <EyeIcon size={18} color="red" />
                                <Text className="text-xs font-bold">{item.ms.toUpperCase()}</Text>
                            </View>
                        </View>
                        <View className=" justify-between px-3">
                            <View className=" flex-row pt-2">
                                <Image source={{ uri: item.t1img }} resizeMode='contain' className="w-8 h-6 rounded-lg justify-start" />
                                <View className="justify-between items-center space-x-20 flex-row ">
                                    <Text className={`text-xs w-28 font-semibold`}>{item.t1} </Text>
                                    <Text className="text-xs m-auto">{item.t1s === '' ? <Text>{renderStatus(item.status)}</Text> : item.t1s}</Text>
                                </View>
                            </View>

                            <View className="w-44 mx-auto items-center justify-center  flex-row">
                                <Text className="h-px w-3/4 bg-gray-500" ></Text>
                                <View className="bg-gray-500 rounded-2xl mx-1">
                                    <Text className="text-white font-bold  p-1  shadow-gray-500 shadow-md" >VS</Text>
                                </View>
                                <Text className="h-px w-3/4 bg-gray-500" ></Text>

                            </View>

                            <View className="flex-row">
                                <Image source={{ uri: item.t2img }} resizeMode='contain' className="w-8 h-6 rounded-lg justify-start" />
                                <View className="justify-between space-x-20  items-center flex-row ">
                                    <Text className={`text-xs w-28 font-semibold`}>{item.t2} </Text>
                                    <Text className="text-xs m-auto">{item.t2s === '' ? <Text>{renderStatus(item.status)}</Text> : item.t2s}</Text>
                                </View>

                            </View>

                        </View>

                    </View>
                    <View className="p-2 items-center">
                        <Text className="text-xs font-semibold">{item.status}</Text>
                    </View>

                </View>
                // </View>

            )} keyExtractor={(item) => item.id.toString()}
                //control to refreh our live.jsx page
                refreshControl={
                    <RefreshControl  //import RefreshControl from react-native
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            />

        </SafeAreaView>
    )
};

export const Upcoming = ({ limit }) => {
    const [matchesData, setMatchesData] = useState([]);
    // const [selectedMatch, setSelectedMatch] = useState(null); // State to track the selected match

    useEffect(() => {
        const fetchData = async () => {
            const upcomming = await upcommingMatches();
            setMatchesData(upcomming.slice(0, limit))
        }

        fetchData();
    }, []);

    if (matchesData.length === 0) {
        // Data is not loaded yet, show loading message or loader here
        return (
            <View className="items-center m-auto ">
                <ActivityIndicator size={55} color="blue" />
            </View>
        );
    }
    const convertToLocaleDateTime = (dateTimeGMT) => {  // fetch date from api 
        const date = new Date(dateTimeGMT);
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return date.toLocaleString(undefined, options);
    };
    const convertToLocaleTime = (dateTimeGMT) => {  // fetch time from api
        const date = new Date(dateTimeGMT);
        const dateIST = new Date(date.getTime() + (5 * 60 + 30) * 60000); // Adding 5 hours and 30 minutes in milliseconds
        const options = {
            timeZone: 'IST',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        };
        return dateIST.toLocaleString(undefined, options);
    };

    // const handleMatchClick = (match) => {  // show to details if i click
    //     setSelectedMatch(match); // Set the selected match in state
    // };
    // console.log(selectedMatch);
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <FlatList data={matchesData} renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => handleMatchClick(item)}
                    activeOpacity={0.8}
                    key={item.id}
                    className="mt-2 bg-white rounded-2xl py-4 px-5 space-y-2"
                >
                    <View className="flex-row items-center justify-between">
                        <View className="space-y-3">
                            <View className="items-center  flex-row space-x-1">
                                <Image source={{ uri: item.t1img }} resizeMode='contain' className="w-8 h-6 rounded-lg" />
                                <Text className="font-semibold text-xs w-28">{item.t1}</Text>
                            </View>

                            <View className="  items-center justify-center flex-row">
                                <View className="h-px w-20 bg-gray-500"></View>
                                <View className="bg-gray-500 rounded-2xl mx-1">
                                    <Text className="text-white font-bold  p-1 shadow-gray-500 shadow-md" >VS</Text>
                                </View>
                                <View className="h-px w-2/6 bg-gray-500"></View>
                            </View>

                            <View className="items-center flex-row" >
                                <Image source={{ uri: item.t2img }} resizeMode='contain' className="w-8 h-6 rounded-lg" />
                                <Text className="font-bold text-xs w-28">{item.t2}</Text>
                            </View>

                        </View>
                        <View className="items-center justify-center ">
                            <Text className="font-semibold text-lg ">{convertToLocaleTime(item.dateTimeGMT)}</Text>
                        </View>
                    </View>
                    <View className="pt-2 items-center">
                        <Text className="text-xs font-semibold">{convertToLocaleDateTime(item.dateTimeGMT)}</Text>
                    </View>
                </TouchableOpacity>
            )} keyExtractor={(item) => item.id} className="mx-3 " />
            {/* Display match details if a match is selected */}
            {/* {selectedMatch && (
                <View>
                    <Text>Name: {selectedMatch.name}</Text>
                    <Text>Status: {selectedMatch.status}</Text>
                 
                </View>
            )} */}
        </ScrollView>
    );
};


export const Finished = ({ limit }) => {
    const [matchesData, setMatchesData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const liveMatches = await finishedMatches()
            setMatchesData(liveMatches.slice(0, limit));
        };
        fetchData();
    }, []);
    const renderStatus = (status) => {
        if (status.includes('opt to bat')) {
            return 'Yet to bat';
        } else if (status.includes('Innings Break')) {
            return 'Innings Break';
        } else if (status.includes('Match not started')) {
            return 'Match not started';
        } else if (status.includes('Match delayed')) {
            return 'Match delayed';
        } else if (status.includes('Stumps')) {
            return 'Stumps';
        } else if (status.includes('opt to bowl')) {
            return 'Opt to bowl';
        } else if (status.includes('There is no scorecard available for this match')) {
            return '-';
        }
        return status;
    };
    const convertToLocaleDateTime = (dateTimeGMT) => {
        const date = new Date(dateTimeGMT);
        const options = {
            timeZone: 'UTC',
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',

        };
        return date.toLocaleString(undefined, options);
    };

    // const extractAbbreviation = (name) => {
    //     if (name && name.includes('[')) {
    //         const splitName = name.split('[');
    //         return splitName[1].slice(0, -1);
    //     }
    //     return '';
    // };
    if (matchesData.length === 0) {
        // Data is not loaded yet, show loading message or loader here
        return (
            <View className="items-center m-auto">
                <ActivityIndicator size={55} color="blue" />
            </View>
        );
    }

    return (
        <ScrollView className="mx-3" showsVerticalScrollIndicator={false}>
            <FlatList data={matchesData} renderItem={({ item }) => (
                <View className="mt-2 pb-3 bg-white rounded-2xl  " key={item.id}>
                    <View className=" items-center pt-1">
                        <Text className="text-xs font-semibold">{convertToLocaleDateTime(item.dateTimeGMT)}</Text>
                    </View>


                    <View className=" justify-between px-3">
                        <View className=" flex-row pt-2">
                            <Image source={{ uri: item.t1img }} resizeMode='contain' className="w-8 h-6 rounded-lg justify-start" />
                            <View className="justify-between items-center space-x-20 flex-row mx-1">
                                <Text className='text-xs w-28 font-semibold'>{item.t1} </Text>
                                <Text className="text-xs "> {item.t1s === '' ? <Text>{renderStatus(item.status)}</Text> : item.t1s} </Text>
                            </View>
                        </View>

                        <View className="w-44 mx-auto items-center justify-center  flex-row">
                            <Text className="h-px w-3/4 bg-gray-500" ></Text>
                            <View className="bg-gray-500 rounded-2xl mx-1">
                                <Text className="text-white font-bold  p-1  shadow-gray-500 shadow-md" >VS</Text>
                            </View>
                            <Text className="h-px w-3/4 bg-gray-500" ></Text>

                        </View>

                        <View className="flex-row">
                            <Image source={{ uri: item.t2img }} resizeMode='contain' className="w-8 h-6 rounded-lg justify-start" />
                            <View className="justify-between space-x-20  items-center flex-row mx-1">
                                <Text className={`text-xs w-28 font-semibold`}>{item.t2} </Text>
                                <Text className="text-xs"> {item.t2s === '' ? <Text>{renderStatus(item.status)}</Text> : item.t2s} </Text>
                            </View>

                        </View>

                    </View>
                    <View className="p-2 mx-auto ">
                        <Text className="text-xs font-semibold">{item.status}</Text>
                    </View>

                </View>


            )} keyExtractor={(item) => item.id.toString()} />
        </ScrollView>
    )
};

export const News = () => {
    const [matchesData, setMatchesData] = useState([]);
    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.cricapi.com/v1/matches?apikey=c844f2a2-87c6-483a-b381-b3dc664f5f29&offset=0');
                // console.log(response.data.data, ".....");
                setMatchesData(response.data.data)
            } catch (error) {
                console.error(error);
            }

        };
        if (matchesData.length === 0) {
            return <View className="items-center my-auto" > <ActivityIndicator size={30} color=" blue" /> </View>
        }
        fetchData();
    }, [])
    return (
        <ScrollView showsVerticalScrollIndicator={false} className="mx-3">
            <FlatList data={matchesData} renderItem={({ item }) => (
                <View View className="pt-6 pb-6 px-5 space-y-2 mt-2 bg-white rounded-2xl " key={item.id}>
                    <View className="flex-row items-center justify-between ">
                        <Text className="font-bold">{item.odi ? `${item.odi} ODI` : ''} Matches</Text>
                        <View className="flex-row items-center justify-center space-x-1 bg-slate-300 rounded-md p-1 opacity-60">

                            <Text className="text-xs font-bold">{item.startDate}</Text>
                        </View>
                    </View>

                    <View className="items-center justify-between flex-row pt-2 ">
                        <View className="items-center justify-center">

                            <Text className="font-semibold text-xs">{item.name}</Text>

                        </View>
                    </View>

                </View >

            )} keyExtractor={(item) => item.id.toString()} className="mb-20" />

        </ScrollView>
    )
};
