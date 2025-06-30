import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";

interface PaymentModalProps {
    total: number;
    close: () => void;
}

const PaymentModal = ({
    total,
    close,
}: PaymentModalProps) => {
    const [receivedAmount, setReceivedAmount] = useState("");

    const received = Number.parseFloat(receivedAmount) || 0;
    const change = received - total;

    const handleNumpadClick = (value: string) => {
        if (value === "clear") {
            setReceivedAmount("");
        } else if (value === "⌫") {
            setReceivedAmount((prev) => prev.slice(0, -1));
        } else if (value === ",") {
            if (!receivedAmount.includes(".")) {
                setReceivedAmount((prev) => prev + ".");
            }
        } else {
            setReceivedAmount((prev) => prev + value);
        }
    };

        return (
            <Modal
                transparent={true}
                animationType="none"
                visible={true}
                onRequestClose={close}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={close}
                >
                    <Pressable
                        style={styles.modalContent}
                        onPress={(e) => e.stopPropagation()} 
                    >
                    {/* Total, Received, Change */}
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Gesamt</Text>
                            <Text style={styles.value}>{total.toFixed(2)}€</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Erhalten</Text>
                            <Text style={styles.value}>{received.toFixed(2)}€</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Rückgeld</Text>
                            <Text
                                style={[
                                    styles.value,
                                    { color: change >= 0 ? "green" : "red" },
                                ]}
                            >
                                {received > 0 ? change.toFixed(2) : "0.00"}€
                            </Text>
                        </View>
                    </View>

                    {[["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], [",", "0", "⌫"]].map((nums) => (
                        <View style={styles.grid}>
                            {nums.map((num) => (
                                <TouchableOpacity
                                    style={styles.numpadButton}
                                    onPress={() => handleNumpadClick(num)}
                                >
                                    <Text style={styles.buttonText}>{num}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}

                    <View style={styles.row}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => setReceivedAmount("")}
                        >
                            <Text style={styles.buttonText}>Zurücksetzen</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={close}
                        >
                            <Text style={styles.buttonText}>Schließen</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        width: 400,
    },
    innerContent: {
        flex: 1,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10,
    },
    column: {
        alignItems: "center",
    },
    label: {
        fontSize: 14,
        color: "gray",
    },
    value: {
        fontSize: 18,
        fontWeight: "bold",
    },
    grid: {
        flexDirection: "row",
        justifyContent: "center",
    },
    numpadButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        height: 60,
        margin: 10,
    },
    actionButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        padding: 10,
        marginHorizontal: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
    },
});

export default PaymentModal;