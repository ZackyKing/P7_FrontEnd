import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import API_URL from "../../config/config";

export default function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, { username, password });
            const { token } = response.data.data;
            await AsyncStorage.setItem("token", token);
            setDialogMessage("Login successful!");
            setIsSuccess(true);
            setDialogVisible(true);
        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || "An error occurred";
            setDialogMessage(errorMessage);
            setIsSuccess(false);
            setDialogVisible(true);
        }
    };

    const handleDialogDismiss = () => {
        setDialogVisible(false);
        if (isSuccess) {
            router.replace("/(tabs)");
        }
    };

    return (
        <PaperProvider>
            <ThemedView style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image source={require("../../assets/images/icon.png")} style={styles.logo} />
                </View>
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Log in to continue</Text>
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
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.registerButton} onPress={() => router.push("/auth/RegisterScreen")}>
                    <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={handleDialogDismiss}>
                        <Dialog.Title>{isSuccess ? "Success" : "Login Failed"}</Dialog.Title>
                        <Dialog.Content>
                            <Text>{dialogMessage}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={handleDialogDismiss}>OK</Button>
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
    logoContainer: {
        marginBottom: 24,
        alignItems: "center",
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: "contain",
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
    loginButton: {
        width: "100%",
        height: 48,
        backgroundColor: "#00509E",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    loginButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    registerButton: {
        width: "100%",
        height: 48,
        borderWidth: 1,
        borderColor: "#00509E",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    registerButtonText: {
        color: "#00509E",
        fontSize: 16,
        fontWeight: "600",
    },
});
