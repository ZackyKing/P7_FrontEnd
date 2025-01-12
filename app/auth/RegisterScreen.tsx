import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { ThemedView } from "@/components/ThemedView";
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import API_URL from "../../config/config";

export default function RegisterScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        try {
            await axios.post(`${API_URL}/api/auth/register`, { username, password, email });
            router.replace("/auth/LoginScreen");
        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || "An error occurred";
            setDialogMessage(errorMessage);
            setDialogVisible(true);
        }
    };

    return (
        <PaperProvider>
            <ThemedView style={styles.container}>
                <Text style={styles.title}>Create an Account</Text>
                <Text style={styles.subtitle}>Join us and get started</Text>
                <View style={styles.inputContainer}>
                    <Icon name="account" size={24} color="#ccc" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="#ccc"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="email" size={24} color="#ccc" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#ccc"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="lock" size={24} color="#ccc" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#ccc"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/auth/LoginScreen")}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                        <Dialog.Title>Registration Failed</Dialog.Title>
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#001f3f",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#ffffff",
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 24,
        color: "#cccccc",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 48,
        borderColor: "#00509E",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
        backgroundColor: "#00274d",
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        color: "#ffffff",
    },
    registerButton: {
        width: "100%",
        height: 48,
        backgroundColor: "#00509E",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    registerButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    loginButton: {
        width: "100%",
        height: 48,
        borderWidth: 1,
        borderColor: "#00509E",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    loginButtonText: {
        color: "#00509E",
        fontSize: 16,
        fontWeight: "600",
    },
});
