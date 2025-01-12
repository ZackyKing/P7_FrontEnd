import React, {useEffect, useState} from 'react';
import {FlatList, KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Dialog,
    FAB,
    Portal,
    Provider as PaperProvider,
    Text,
    TextInput
} from 'react-native-paper';
import {useRouter} from 'expo-router';
import {ThemedView} from '@/components/ThemedView';
import {ThemedText} from '@/components/ThemedText';
import {useTodos} from '@/context/TodoContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from '@/config/config';
import Constants from "expo-constants/src/Constants";

const TodosScreen = () => {
    const {todos, fetchTodos} = useTodos();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const loadTodos = async () => {
            setLoading(true);
            await fetchTodos();
            setLoading(false);
        };
        loadTodos();
    }, []);

    const handleAddTodo = async () => {
        if (!title || !description) {
            setDialogMessage('Both title and description are required.');
            setDialogVisible(true);
            return;
        }
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.post(`${API_URL}/api/todos`, {
                title,
                description
            }, {headers: {Authorization: `Bearer ${token}`}});
            fetchTodos();
            setTitle('');
            setDescription('');
            setIsAdding(false);
        } catch (error) {
            setDialogMessage('Failed to add todo');
            setDialogVisible(true);
        }
    };

    const handleDeleteTodo = async (id: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${API_URL}/api/todos/${id}`, {headers: {Authorization: `Bearer ${token}`}});
            fetchTodos();
        } catch (error) {
            setDialogMessage('Failed to delete todo');
            setDialogVisible(true);
        }
    };

    return (
        <PaperProvider>
            <ThemedView style={styles.container}>
                <ThemedText style={styles.title} type="title">ToDo List</ThemedText>
                {loading ? (
                    <ActivityIndicator style={styles.loading} animating={true} color="#ffffff" />
                ) : (
                    <FlatList
                        data={todos}
                        keyExtractor={(item) => item._id}
                        renderItem={({item}) => (
                            <Card style={styles.card} mode="elevated" onPress={() => router.push(`../todo/${item._id}`)}>
                                <Card.Content>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                    <Text style={styles.cardDescription}>{item.description}</Text>
                                </Card.Content>
                                <Card.Actions>
                                    <Button
                                        onPress={() => handleDeleteTodo(item._id)}
                                        textColor="#ff6666"
                                    >
                                        Delete
                                    </Button>
                                </Card.Actions>
                            </Card>
                        )}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
                {isAdding && (
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                                          style={styles.inputContainer}>
                        <TextInput 
                            label="Title" 
                            value={title} 
                            onChangeText={setTitle} 
                            style={styles.input}
                            mode="outlined" 
                            outlineColor="#00509E"
                            activeOutlineColor="#007BFF"
                            textColor="#ffffff"
                        />
                        <TextInput 
                            label="Description" 
                            value={description} 
                            onChangeText={setDescription}
                            style={styles.input} 
                            mode="outlined" 
                            outlineColor="#00509E"
                            activeOutlineColor="#007BFF"
                            multiline 
                            textColor="#ffffff"
                        />
                        <Button mode="contained" onPress={handleAddTodo} style={styles.addButton} buttonColor="#007BFF">
                            Add Todo
                        </Button>
                        <Button onPress={() => setIsAdding(false)} style={styles.cancelButton} textColor="#cccccc">
                            Cancel
                        </Button>
                    </KeyboardAvoidingView>
                )}
                {!isAdding && (
                    <FAB
                        style={styles.fab}
                        icon="plus"
                        onPress={() => setIsAdding(true)}
                        color="#ffffff"
                        label="Add Todo"
                    />
                )}
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                        <Dialog.Title>Alert</Dialog.Title>
                        <Dialog.Content>
                            <Text>{dialogMessage}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setDialogVisible(false)}>OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ThemedView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#001f3f",
    },
    title: {
        marginTop: 16,
        marginHorizontal: 16,
        fontSize: 24,
        color: "#ffffff",
        fontWeight: "bold",
    },
    listContainer: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: "#00274d",
    },
    cardTitle: {
        fontSize: 18,
        color: "#ffffff",
        fontWeight: "600",
    },
    cardDescription: {
        fontSize: 14,
        color: "#cccccc",
        marginTop: 4,
    },
    fab: {
        position: "absolute",
        right: 16,
        bottom: 16,
        backgroundColor: "#007BFF",
    },
    inputContainer: {
        padding: 16,
        backgroundColor: "#00274d",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    input: {
        marginBottom: 12,
        backgroundColor: "#001f3f",
    },
    addButton: {
        marginTop: 12,
    },
    cancelButton: {
        marginTop: 8,
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default TodosScreen;
