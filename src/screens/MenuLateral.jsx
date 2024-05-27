import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
    container: {
        position: 'absolute',
        top: 0,
        width: 200,
        height: '100%',
        backgroundColor: '#203555',
        borderColor: 'black',
        borderWidth: 2,
        zIndex: 2,
        padding: 20,
        justifyContent: 'center', 
    },
    empresaNome: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Times new roman',
    },
    divisor: {
        borderBottomWidth: 2,
        borderBottomColor: 'white',
        marginBottom: 20,
        padding: 10,
    },
    opcao: {
        marginBottom: 10,
        padding: 20,
        borderColor: 'white', 
        borderWidth: 2,
        borderRadius: 50,
    },
    opcaoTexto: {
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Arial',
        color: 'white',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    icon: {
        marginRight: 5,
    },
});

// Menu lateral
const MenuLateral = ({ isOpen, onClose, navigation }) => {
    const [empresaNome, setEmpresaNome] = useState('');

    useEffect(() => {
        const fetchEmpresaNome = async () => {
            try {
                const response = await axios.get('http://192.168.1.22:3000/empresas');
                if (response.data.length > 0) {
                    setEmpresaNome(response.data[0].nome);
                }
            } catch (error) {
                console.error('Erro ao buscar nome da empresa:', error);
            }
        };

        fetchEmpresaNome();
    }, []);


    const fecharMenu = () => {
        if (isOpen) {
            onClose();
        }
    };

    const navigateToScreen = (screenName) => {
        navigation.navigate(screenName);
        onClose(); 
    };

    const handleLink = (link) => {
        Linking.openURL(link);
    };

    return (
        <TouchableOpacity style={[styles.overlay, { display: isOpen ? 'flex' : 'none' }]} onPress={fecharMenu}>
            <View style={styles.container}>
                <Text style={styles.empresaNome}>{empresaNome}</Text>
                <View style={styles.divisor}></View>
                <TouchableOpacity style={styles.opcao} onPress={() => navigateToScreen('Home')}>
                    <Text style={styles.opcaoTexto}>Tela inicial</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.opcao} onPress={() => navigateToScreen('ConsultoriaContato')}>
                    <Text style={styles.opcaoTexto}>Contato com a Consultoria</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.opcao} onPress={() => navigateToScreen('Sobre')}>
                    <Text style={styles.opcaoTexto}>Sobre nós</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.opcao} onPress={() => handleLink('http://192.168.1.22:3001/login')}>
                    <Text style={styles.opcaoTexto}>Área do consultor</Text>
                </TouchableOpacity>
                <View style={styles.divisor}></View>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => handleLink('https://api.whatsapp.com')}>
                        <Icon name="whatsapp" size={30} color="#25D366" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleLink('https://www.instagram.com')}>
                        <Icon name="instagram" size={30} color="#E1306C" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleLink('https://www.facebook.com')}>
                        <Icon name="facebook" size={30} color="#1877F2" style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default MenuLateral;
