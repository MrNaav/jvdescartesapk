import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback, Modal } from 'react-native';
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
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        fontFamily: 'Arial',
    },
    input: {
        backgroundColor: '#4FD271',
        height: 40,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontFamily: 'Times new Roman',
    },
    dropdownContainer: {
        backgroundColor: '#4FD271',
        height: 40,
        marginBottom: 20,
    },
    dropdown: {
        backgroundColor: '#4FD271',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#4FD271',
        borderColor: 'black',
        borderWidth: 2,
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        width: '90%',
    },
});

// Tela Contato com a consultoria
const ConsultoriaContato = () => {
    const navigation = useNavigation();

    const [searchQuery, setSearchQuery] = useState('');
    const [nome, setNome] = useState('');
    const [contato, setContato] = useState('');
    const [email, setEmail] = useState('');
    const [motivo, setMotivo] = useState('');
    const [detalhes, setDetalhes] = useState('');
    const [motivoOpen, setMotivoOpen] = useState(false);
    const [itensDescarte, setItensDescarte] = useState([]);
    const [menuAberto, setMenuAberto] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const motivos = [{ label: 'Dúvidas', value: 'Dúvidas' }, { label: 'Suporte', value: 'Suporte' },
                     { label: 'Sugestões', value: 'Sugestões' }, { label: 'Reclamações', value: 'Reclamações' },
                     { label: 'Serviço', value: 'Serviço' }, { label: 'Outros', value: 'Outros' }];

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

    const handleSearchItem = () => {
        const itemEncontrado = itensDescarte.find(item => item.nome === searchQuery);

        if (itemEncontrado) {
            setSearchQuery('');
            navigation.navigate('DetalhesItem', { item: itemEncontrado });
        } else {
            Alert.alert('Item não encontrado', `O item "${searchQuery}" não foi encontrado`);
        }
    };

    const handleSubmit = async () => {
        try {
            if (!nome) {
                Alert.alert('Erro', 'Por favor, escreva seu nome.');
                return; 
            }
            if (!contato) {
                Alert.alert('Erro', 'Por favor, cite seu telefone.');
                return; 
            }
            if (!Number.isInteger(parseInt(contato))) {
                Alert.alert('Formato correto do contato DDD e número: (44999999999)');
                return;
            } 
            if (!email) {
                Alert.alert('Erro', 'Por favor, cite seu email.');
                return; 
            }
            if (!motivo) {
                Alert.alert('Erro', 'Por favor, selecione um motivo.');
                return; 
            }
            if (!detalhes) {
                Alert.alert('Erro', 'Por favor, escreva os detalhes do contato.');
                return; 
            }

            const response = await axios.post('http://192.168.1.22:3000/contato_consultoria', {
                nome,
                contato,
                email,
                motivo,
                detalhes,
            });

            if (response.status === 201) {
                Alert.alert('Sucesso', 'Contato enviado com sucesso!');
                setNome('');
                setContato('');
                setEmail('');
                setMotivo('');
                setDetalhes('');
            }
        } catch (error) {
            Alert.alert('Erro', 'Erro ao enviar contato. Tente novamente.');
            console.error(error);
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
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                                required={true}
                            />
                            <TouchableOpacity style={styles.searchIcon} onPress={handleSearchItem}>
                                <Icon name="search" size={20} style={styles.menuIcon} />
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <Text style={styles.title}>Contato com a Consultoria</Text>
                <Text>Nome</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="black"
                    onChangeText={(text) => {
                        if (text.length < 50) {
                            setNome(text);
                        } else {
                            setNome(text.substring(0, 50));
                            Keyboard.dismiss();
                        }
                    }}
                    value={nome}
                    maxLength={50}
                    required={true}
                />
                <Text>Telefone</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="black"
                    onChangeText={(text) => {
                        if (text.length < 11) {
                            setContato(text);
                        } else {
                            setContato(text.substring(0, 11));
                            Keyboard.dismiss();
                        }
                    }}
                    value={contato}
                    maxLength={11}
                    required={true}
                />
                <Text>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="black"
                    onChangeText={(text) => {
                        if (text.length < 50) {
                            setEmail(text);
                        } else {
                            setEmail(text.substring(0, 50));
                            Keyboard.dismiss();
                        }
                    }}
                    value={email}
                    maxLength={50}
                    required={true}
                />
                <Text>Motivo</Text>
                <DropDownPicker
                    open={motivoOpen}
                    value={motivo}
                    items={motivos}
                    setOpen={setMotivoOpen}
                    setValue={setMotivo}
                    setItems={setMotivo}
                    placeholder="Selecione..."
                    containerStyle={styles.dropdownContainer}
                    style={styles.dropdown}
                    dropDownContainerStyle={[styles.dropdown , { backgroundColor: '#C0C0C0' }]}
                    onPress={() => Keyboard.dismiss()}
                    required={true}
                />
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>Adicionar Detalhes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Enviar</Text>
                </TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text>Detalhes</Text>
                                <TextInput
                                    style={[styles.input, { height: 200 }]}
                                    placeholderTextColor="black"
                                    onChangeText={(text) => {
                                        if (text.length < 100) {
                                            setDetalhes(text);
                                        } else {
                                            setDetalhes(text.substring(0, 100));
                                            Keyboard.dismiss();
                                        }
                                    }}
                                    value={detalhes}
                                    maxLength={100}
                                    multiline
                                    required={true}
                                />
                                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.buttonText}>Fechar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                <MenuLateral isOpen={menuAberto} onClose={fecharMenu} navigation={navigation} />
            </View>
        </TouchableWithoutFeedback>
    );
};
    
export default ConsultoriaContato;
    
