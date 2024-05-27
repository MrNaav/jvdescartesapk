import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Image, View, TextInput, FlatList, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
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
    imageStyle: {
        alignItems: 'center',
        justifyContent: 'center', 
        marginBottom: 20,
    },    
    searchBar: {
        flex: 1,
        height: 40,
        marginLeft: 10,
        fontFamily: 'Times New Roman',
    },
    item: {
        backgroundColor: '#D0D4CD',
        margin: 6,
        padding: 10,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 30,
        flexBasis: '47%',
    },
    itemContent: {
        alignItems: 'center',
    },
    itemText: {
        fontSize: 15,
        textAlign: 'center',
        fontFamily: 'Arial',
    },
    itemIcon: {
        marginBottom: 5,
    },
    trashIcon: {
        marginRight: 1,
        color: 'black',
    },
    listContainer: {
        backgroundColor: '#4FD271',
        borderColor: 'black',
        borderWidth: 2,
        justifyContent: 'space-between',
    },
});

const HomeScreen = () => {
    const navigation = useNavigation();

    const [searchQuery, setSearchQuery] = useState('');
    const [itensDescarte, setItensDescarte] = useState([]);
    const [menuAberto, setMenuAberto] = useState(false);

    useEffect(() => {
        const fetchItensDescarte = async () => {
            try {
                const response = await axios.get('http://192.168.1.22:3000/itensdescarte');
                setItensDescarte(response.data);
            } catch (error) {
                console.error('Erro ao buscar itens de descarte:', error);
            }
        };

        fetchItensDescarte();
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

    const navigateToDetalhesItem = (item) => {
        navigation.navigate('DetalhesItem', { item });
    };

    const navigateToSobre = () => {
        navigation.navigate('Sobre');
    }

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
                <TouchableOpacity onPress={() => navigateToSobre()}>
                    <View style={styles.imageStyle}>
                        <Image source={require('../../assets/logoEmpresa.jpg')} />
                    </View>
                </TouchableOpacity>
                <FlatList
                    key={2}  
                    contentContainerStyle={styles.listContainer}
                    data={itensDescarte}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigateToDetalhesItem(item)} style={styles.item}>
                            <View style={styles.itemContent}>
                                <Icon name="image" size={50} style={styles.itemIcon} />
                                <Text style={styles.itemText}>{item.nome}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id.toString()}
                    numColumns={2}
                />
                <MenuLateral isOpen={menuAberto} onClose={fecharMenu} navigation={navigation} />
            </View>
        </TouchableWithoutFeedback>
    );
};

export default HomeScreen;
