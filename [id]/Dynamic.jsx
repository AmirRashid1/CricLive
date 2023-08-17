import { View, Text } from 'react-native'
import React from 'react'

const Dynamic = ({ params }) => {
    const data = params.id;
    return (
        <View>
            <Text>Dynamic</Text>
        </View>
    )
}

export default Dynamic