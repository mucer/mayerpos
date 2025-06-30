import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { CartItem } from "../models/cart-item";
import { useCart } from "../providers/cart.provider";
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import PaymentModal from "./payment.modal";


export function Cart() {
    const { items, clear, updateQuantity } = useCart();
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);

    const clearCart = () => {
        clear();
    };

    const calcTotalForItem = (item: CartItem) => item.option.price * item.quantity;

    const total = items.reduce((sum, item) => sum + calcTotalForItem(item), 0);

    const handleCheckout = () => {
        if (items.length > 0) {
            // printBon();
            clearCart();
        }
    };

    return (
        <View style={styles.cartContainer}>
            { showPaymentPopup && (
            <PaymentModal
                total={total}
                close={() => setShowPaymentPopup(false)}/>)}
            <ScrollView style={styles.cartItems}>
                {items.length === 0 ? (
                    <Text style={styles.emptyCartText}>Warenkorb ist leer</Text>
                ) : (items.map((item) => (
                    <View key={item.id} style={styles.cartItem}>
                        <View style={styles.cartItemDetails}>
                            <Text>{item.product.name}</Text>
                            {item.option.name !== "-" && (
                                <Text style={styles.optionName}>{item.option.name}</Text>
                            )}
                        </View>
                        <TouchableOpacity
                            onPress={() => updateQuantity(item.id, item.quantity - 1)}
                            style={styles.quantityButton}
                        >
                            <FontAwesome6 name="minus" iconStyle="solid" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText} >{item.quantity}</Text>
                        <TouchableOpacity
                            onPress={() => updateQuantity(item.id, item.quantity + 1)}
                            style={styles.quantityButton}
                        >
                            <FontAwesome6 name="plus" iconStyle="solid" />
                        </TouchableOpacity>
                        <View style={styles.cartItemPrice}>
                            <Text>{(item.option.price * item.quantity).toFixed(2)}€</Text>
                        </View>
                    </View>
                ))
                )}
            </ScrollView>

            <Text style={styles.totalText}>Gesamt: {total.toFixed(2)} €</Text>

            <View style={styles.actionButtons}>
                <TouchableOpacity
                    onPress={clearCart}
                    style={[styles.actionButton, styles.clearButton]}
                    disabled={items.length === 0}
                >
                    <FontAwesome6 name="trash" iconStyle="solid" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setShowPaymentPopup(true)}
                    style={[styles.actionButton, styles.paymentButton]}
                    disabled={items.length === 0}
                >
                    <FontAwesome6 name="coins" iconStyle="solid" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleCheckout}
                    style={[styles.actionButton, styles.checkoutButton]}
                    disabled={items.length === 0}
                >
                    <FontAwesome6 name="print" iconStyle="solid" />
                </TouchableOpacity>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: "row" },
    productsContainer: { flex: 1, padding: 10 },
    productsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
    productButton: { width: "48%", padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginBottom: 10 },
    productName: { fontWeight: "bold", fontSize: 14 },
    productPrice: { color: "green", fontWeight: "bold", marginTop: 5 },
    cartContainer: { flex: 1, borderLeftWidth: 1, borderColor: "#ccc", padding: 10 },
    cartItems: { flex: 1 },
    emptyCartText: { textAlign: "center", color: "#999", marginTop: 20 },
    sectionHeader: { fontWeight: "bold", fontSize: 12, marginBottom: 5 },
    cartItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
    cartItemDetails: { flex: 1 },
    optionName: { fontSize: 12, color: "#666" },
    quantityButton: { padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5 },
    quantityText: { width: 30, textAlign: "center" },
    cartItemPrice: { alignItems: "flex-end", width: 60 },
    depositText: { fontSize: 12, color: "#666" },
    totalText: { fontWeight: "bold" },
    actionButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
    actionButton: { padding: 20, borderRadius: 5, width: 70, alignItems: "center", justifyContent: "center" },
    clearButton: { backgroundColor: "red" },
    paymentButton: { backgroundColor: "blue" },
    checkoutButton: { backgroundColor: "green" },
});