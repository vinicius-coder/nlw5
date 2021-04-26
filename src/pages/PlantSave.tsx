import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    Alert,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgFromUri } from 'react-native-svg';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { format, isBefore } from 'date-fns';
import { PlantProps, savePlant } from '../libs/storage';

import { Button } from '../components/Button';

import waterdrop from '../assets/waterdrop.png';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface Params {
    plant: PlantProps;
}

export function PlantSave() {

    const [selectedDataTime, setSelectedDateTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');

    const route = useRoute();
    const { plant } = route.params as Params;

    const navigation = useNavigation();

    function handleChangeTime(event: Event, dateTime: Date | undefined) {

        if (Platform.OS === 'android') {
            setShowDatePicker(oldState => !oldState);
        }

        if (dateTime && isBefore(dateTime, new Date())) {
            setSelectedDateTime(new Date());
            return Alert.alert(
                'Data e horário inválidos',
                'Escolha uma data futura por gentileza. 🧭');
        }

        if (dateTime) {
            setSelectedDateTime(dateTime);
        }

    }

    function handleOpenDatatimePickerForAndroid() {
        setShowDatePicker(oldState => !oldState);
    }

    async function handleSave() {

        try {

            await savePlant({
                ...plant,
                dateTimeNotification: selectedDataTime
            });

            navigation.navigate('Confirmation', {
                title: 'Tudo certo',
                subTitle: 'Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha com muito cuidado.',
                buttonTitle: 'Muito obrigado',
                icon: 'hug',
                nextScreen: 'MyPlants'
            });

        } catch (error) {
            return Alert.alert(
                'Erro',
                'Não foi possível salvar suas informações. 😔');
        }

    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                <View style={styles.plantInfo}>
                    <SvgFromUri
                        uri={plant.photo}
                        height={150}
                        width={150}
                    />
                    <Text style={styles.plantName}>{plant.name}</Text>
                    <Text style={styles.plantAbout}>
                        {plant.about}
                    </Text>
                </View>

                <View style={styles.controller}>
                    <View style={styles.tipContainer}>
                        <Image
                            source={waterdrop}
                            style={styles.tipImage}
                        />
                        <Text style={styles.tipText}>
                            {plant.water_tips}
                        </Text>
                    </View>

                    <Text style={styles.alertLabel}>
                        Escolha o melhor horário para ser lembrado
                    </Text>

                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDataTime}
                            mode="time"
                            display="spinner"
                            onChange={handleChangeTime}
                        />
                    )}

                    {Platform.OS === 'android' && (
                        <TouchableOpacity
                            style={styles.dataTimePickerButton}
                            onPress={handleOpenDatatimePickerForAndroid}
                        >
                            <Text style={styles.dataTimePickerText}>
                                {`Mudar ${format(selectedDataTime, 'HH:mm')}`}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <Button
                        title="Cadastrar planta"
                        onPress={handleSave}
                    />
                </View>
            </ScrollView>
        </ SafeAreaView>
    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.shape,
    },

    plantInfo: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.shape
    },

    controller: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        marginTop: 30,
        paddingTop: 20,
        paddingBottom: getBottomSpace() || 10,
    },

    plantName: {
        fontFamily: fonts.heading,
        fontSize: 24,
        color: colors.heading,
        marginTop: 15
    },

    plantAbout: {
        textAlign: 'center',
        fontFamily: fonts.text,
        color: colors.heading,
        fontSize: 17,
        marginTop: 10,
    },

    tipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.blue_light,
        padding: 20,
        borderRadius: 20,
        position: 'relative',
        bottom: 60,
    },

    tipImage: {
        width: 56,
        height: 56,
    },

    tipText: {
        flex: 1,
        marginLeft: 20,
        fontFamily: fonts.text,
        color: colors.blue,
        fontSize: 17,
        textAlign: 'justify'
    },

    alertLabel: {
        textAlign: 'center',
        fontFamily: fonts.complement,
        color: colors.heading,
        fontSize: 12,
        marginBottom: 5,
    },

    dataTimePickerButton: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 20,
    },

    dataTimePickerText: {
        color: colors.heading,
        fontSize: 24,
        fontFamily: fonts.text,
    }


})