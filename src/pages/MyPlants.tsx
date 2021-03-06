import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import { pt } from 'date-fns/locale';
import { loadPlant, PlantProps, removePlants } from '../libs/storage';
import { formatDistance } from 'date-fns/esm';

import { Header } from '../components/Header';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';

import waterdrop from '../assets/waterdrop.png';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function MyPlants() {

    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextWaterd, setNextWaterd] = useState<string>();

    function handleRemove(plant: PlantProps) {

        Alert.alert("Remover", `Deseja remover a ${plant.name} da sua lista?`, [
            {
                text: 'Não',
                style: 'cancel'
            },
            {
                text: 'Sim',
                onPress: async () => {
                    try {
                        await removePlants(plant.id);
                        setMyPlants((oldData) => 
                            oldData.filter((item) => item.id !== plant.id)
                        );
                    } catch (error) {
                        Alert.alert('Erro', 'Não foi possível remover.')
                    }
                },
            }
        ])

    }

    useEffect(() => {

        async function loadStorageData() {
            const plantsStoraged = await loadPlant();

            const nextTime = formatDistance(
                new Date(plantsStoraged[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                { locale: pt }
            );

            setNextWaterd(
                `Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime} horas.`
            )

            setMyPlants(plantsStoraged);
            setLoading(false);
        }

        loadStorageData();

    }, []);

    if (loading)
        return <Load />

    return (
        <SafeAreaView style={styles.container}>
            <Header />

            <View style={styles.spotlight}>
                <Image
                    source={waterdrop}
                    style={styles.spotlightImage}
                />

                <Text style={styles.spotlightText}>
                    {nextWaterd}
                </Text>
            </View>



            <View style={styles.plants}>
                <Text style={styles.plantsTitle}> Próximas regadas</Text>

                <FlatList
                    data={myPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <PlantCardSecondary
                            data={item}
                            handleRemove={() => { handleRemove(item) }}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 10 }}
                />

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: colors.background,
    },

    spotlight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    spotlightImage: {
        width: 60,
        height: 60,
    },

    spotlightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,
    },

    plants: {
        flex: 1,
        width: '100%',
    },

    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 15
    }

})