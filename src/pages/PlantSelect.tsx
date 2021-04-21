import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import {
    Text,
    StyleSheet,
    SafeAreaView,
    View,
    FlatList
} from 'react-native';
import { EnviromentButton } from '../components/EnviromentButton';

import { Header } from '../components/Header';
import api from '../services/api';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface EnviromentsProps {
    key: string;
    title: string;
}

export function PlantSelect() {

    const [enviroments, setEnviroments] = useState<EnviromentsProps[]>();

    useEffect(() => {

        async function fetchEnvironment() {
            const { data } = await api.get('plants_environments');
            setEnviroments([
                {
                    key: 'all',
                    title: 'Todos',
                },
                ...data
            ]);
        }

        fetchEnvironment();

    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>

                <Header />

                <Text style={styles.title}>Em qual ambiente</Text>

                <Text style={styles.subTitle}>Você quer colocar sua planta?</Text>

            </View>

            <View>
                <FlatList
                    data={enviroments}
                    renderItem={({ item }) => (
                        <EnviromentButton
                            title={item.title}
                            active={false}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.enviromentList}
                />
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    header: {
        paddingHorizontal: 30,
    },

    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15,
    },

    subTitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading,
    },

    enviromentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        marginLeft: 32,
        marginVertical: 32,
    }

})