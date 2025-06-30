import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CartItem } from "../models/cart-item";
import { useCart } from "../providers/cart.provider";
import PaymentModal from "./payment.modal";

interface CardProps {
    print(items: CartItem[]): Promise<boolean>;
}

export function Cart({ print }: CardProps) {
    const { items, clear, updateQuantity } = useCart();
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);

    const clearCart = () => {
        clear();
    };

    const calcTotalForItem = (item: CartItem) => item.option.price * item.quantity;

    const total = items.reduce((sum, item) => sum + calcTotalForItem(item), 0);

    const handleCheckout = () => {
        if (items.length > 0) {
            print(items).then(success => {
                if (success) clearCart();
            });
        }
    };

    return (
        <View style={styles.cartContainer}>
            {showPaymentPopup && (
                <PaymentModal
                    total={total}
                    close={() => setShowPaymentPopup(false)} />)}
            <ScrollView style={styles.cartItems}>
                {items.length === 0 ? (
                    <Text style={styles.emptyCartText}>Warenkorb ist leer</Text>
                ) : (items.map((item) => (
                    <View key={item.id} style={styles.cartItem}>
                        <View style={styles.cartItemDetails}>
                            <Text style={styles.productName}>{item.product.name}</Text>
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
                    <FontAwesome6 name="trash" iconStyle="solid" color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setShowPaymentPopup(true)}
                    style={[styles.actionButton, styles.paymentButton]}
                    disabled={items.length === 0}
                >
                    <FontAwesome6 name="coins" iconStyle="solid" color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleCheckout}
                    style={[styles.actionButton, styles.checkoutButton]}
                    disabled={items.length === 0}
                >
                    <FontAwesome6 name="print" iconStyle="solid" color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: "row" },
    cartContainer: { flex: 1, borderLeftWidth: 1, borderColor: "#ccc", padding: 10 },
    cartItems: { flex: 1 },
    emptyCartText: { textAlign: "center", color: "#999", marginTop: 20 },
    cartItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
    cartItemDetails: { flex: 1 },
    productName: { fontSize: 16 },
    optionName: { fontSize: 14, color: "#666" },
    quantityButton: { padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5 },
    quantityText: { fontSize: 16, width: 30, textAlign: "center" },
    cartItemPrice: { fontSize: 16, alignItems: "flex-end", width: 60 },
    totalText: { fontSize: 18, fontWeight: "bold" },
    actionButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
    actionButton: { padding: 20, borderRadius: 5, width: 70, alignItems: "center", justifyContent: "center" },
    clearButton: { backgroundColor: "red" },
    paymentButton: { backgroundColor: "blue" },
    checkoutButton: { backgroundColor: "green" },
});