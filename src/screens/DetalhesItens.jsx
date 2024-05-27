import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
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
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    searchBar: {
        flex: 1,
        height: 40,
        marginLeft: 10,
        fontFamily: 'Times new Roman',
    },
    title: {
        backgroundColor: '#4FD271',
        borderColor: 'black', 
        borderWidth: 2, 
        fontSize: 30,
        textAlign: 'center',
        padding: 10,
        marginBottom: 10, 
        alignItems: 'center', 
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    description: {
        backgroundColor: '#4FD271',
        borderColor: 'black',
        borderWidth: 2,
        padding: 10,
        fontSize: 16,
        marginTop: 5,
    },
    dropdownContainer: {
        height: 80,
        marginTop: 10,
    },
    dropdown: {
        backgroundColor: '#4FD271',
        borderColor: 'black',
        borderWidth: 2,
        height: 120,
    },
    localidadesStryle: {
        backgroundColor: '#4FD271',
        borderColor: 'black',
        borderWidth: 2,
        padding: 10,
        fontSize: 16,
    }
});

// Tela de DetalhesItens
const DetalhesItens = ({ route }) => {
    const navigation = useNavigation();

    const { item } = route.params;
    const [searchQuery, setSearchQuery] = useState('');
    const [itensDescarte, setItensDescarte] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    const [menuAberto, setMenuAberto] = useState(false);
    const [localidadeOpen, setLocalidadeOpen] = useState(false);
    const [localidadeSelecionada, setLocalidadeSelecionada] = useState(null);

    useEffect(() => {
        const fetchItensDescarte = async () => {
            try {
                const response = await axios.get('http://192.168.1.22:3000/itensdescarte');
                setItensDescarte(response.data);
            } catch (error) {
                console.error('Erro ao buscar itens:', error);
            }
        };

        fetchItensDescarte();
    }, []);

    useEffect(() => {
        const fetchLocalidades = async () => {
            try {
                const response = await axios.get(`http://192.168.1.22:3000/itensdescarte/${item.id}/localidades`);
                setLocalidades(response.data);
            } catch (error) {
                console.error('Erro ao buscar localidades de descarte:', error);
            }
        };

        fetchLocalidades();
    }, [item]);

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

    const handleLocalidadeChange = (localidade) => {
        setLocalidadeSelecionada(localidade);
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
                <Text style={styles.title}>{item.nome}</Text>
                <Text style={styles.label}>Descrição</Text>
                <Text style={styles.description}>{item.descricao}</Text>
                <Text style={styles.label}>Riscos</Text>
                <Text style={styles.description}>{item.riscos}</Text>
                <Text style={styles.label}>Locais de Descarte</Text>
                <DropDownPicker
                    items={localidades.map(localidade => ({
                        label: `Nome: ${localidade.nome}, \nHorário de funcionamento: ${localidade.horario_funcionamento}, \nEndereço: ${localidade.endereco.rua}, ${localidade.endereco.numero}, ${localidade.endereco.complemento}, ${localidade.endereco.bairro}, ${localidade.endereco.cidade}, ${localidade.endereco.estado}, ${localidade.endereco.pais}`,
                        value: localidade.id
                    }))}
                    open={localidadeOpen}
                    value={localidadeSelecionada}
                    setOpen={setLocalidadeOpen}
                    setValue={handleLocalidadeChange}
                    placeholder="Selecione..."
                    containerStyle={styles.dropdownContainer}
                    style={styles.dropdown}
                    dropDownContainerStyle={[styles.dropdown, { position: 'absolute', top: 124, backgroundColor: '#C0C0C0' }]}
                    itemSeparator={true} 
                />
                <MenuLateral isOpen={menuAberto} onClose={fecharMenu} navigation={navigation} />
            </View>
        </TouchableWithoutFeedback>
    );  
};

export default DetalhesItens;
