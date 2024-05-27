import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import MenuLateral from './MenuLateral';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D0D4CD',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    menuIcon: {
        marginLeft: 5,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 30,
        paddingHorizontal: 10,
    },
    searchBar: {
        flex: 1,
        height: 40,
        marginLeft: 10,
        fontFamily: 'Times new Roman',
    },
    sobreTitle: {
        fontSize: 25,
        marginVertical: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Arial',
    },
    empresaInfo: {
        alignItems: 'center',
    },
    empresaName: {
        backgroundColor: '#4FD271',
        width: '100%',
        padding: 10,
        marginVertical: 15,
        borderColor: 'black',
        textAlign: 'center',
        borderWidth: 2,
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: 'Times new roman',
    },
    empresaDescription: {
        backgroundColor: '#4FD271',
        borderColor: 'black',
        borderWidth: 2,
        padding: 15,
        fontSize: 20,
        textAlign: 'justify',
        fontFamily: 'Arial',
    },
});

// Tela Sobre
const Sobre = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [empresa, setEmpresa] = useState('');
    const [itensDescarte, setItensDescarte] = useState([]);
    const [menuAberto, setMenuAberto] = useState(false);

    useEffect(() => {
        const fetchEmpresaData = async () => {
            try {
                const response = await axios.get('http://192.168.1.22:3000/empresas');
                if (response.data.length > 0) {
                    setEmpresa(response.data[0]);
                }
            } catch (error) {
                console.error('Erro ao buscar dados da empresa:', error);
            }
        };

        const fetchItensDescarte = async () => {
            try {
                const response = await axios.get('http://192.168.1.22:3000/itensdescarte');
                setItensDescarte(response.data);
            } catch (error) {
                console.error('Erro ao buscar itens:', error);
            }
        };

        fetchItensDescarte();
        fetchEmpresaData();
    }, []);

    const handleSearchItem = () => {
        const itemEncontrado = itensDescarte.find(item => item.nome === searchQuery);
      
        if (itemEncontrado) {
            setSearchQuery('');
            navigation.navigate('DetalhesItem', { item: itemEncontrado });
        } else {
            Alert.alert('Item não encontrado', `O item "${searchQuery}" não foi encontrado.`);
        }
    };

    const toggleMenu = () => {
        setMenuAberto(!menuAberto);
    };

    const fecharMenu = () => {
        setMenuAberto(false);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.searchContainer}>
                      <TouchableOpacity onPress={toggleMenu}>
                          <Icon name="menu" size={30} style={styles.menuIcon} />
                      </TouchableOpacity>
                      <TextInput
                          style={styles.searchBar}
                          placeholder="Pesquisar itens..."
                          placeholderTextColor="black"
                          onChangeText={(text) => {
                              if (text.length < 30) {
                                  setSearchQuery(text);
                              } else {
                                  setSearchQuery(text.substring(0, 30));
                                  Keyboard.dismiss();
                              }
                          }}
                          value={searchQuery}
                          maxLength={30}
                      />
                      <TouchableOpacity style={styles.searchIcon} onPress={handleSearchItem}>
                          <Icon name="search" size={20} style={styles.menuIcon}/>
                      </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.sobreTitle}>Sobre nós</Text>
                <View style={styles.empresaInfo}>
                    <Text style={styles.empresaName}>{empresa.nome}</Text>
                    <Text style={styles.empresaDescription}>{empresa.descricao}</Text>
                </View>
                <MenuLateral isOpen={menuAberto} onClose={fecharMenu} navigation={navigation} />
            </View>
        </TouchableWithoutFeedback>
    );  
};

export default Sobre;
