import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Pressable } from "react-native";
import { Product, ProductOption } from "../models/product";
import { useCart } from "../providers/cart.provider";
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

export interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  const [showOptionPopup, setShowOptionPopup] = useState<Product | null>(null);
  const { addToCart } = useCart();

  const handleProductClick = (product: Product) => {
    if (product.options.length === 1) {
      addToCart(product, product.options[0]);
    } else {
      setShowOptionPopup(product);
    }
  };

  const handleOptionSelect = (option: ProductOption) => {
    if (showOptionPopup) {
      addToCart(showOptionPopup, option);
      setShowOptionPopup(null);
    }
  };

  const getPriceDisplay = (product: Product) => {
    if (product.options.length === 1) {
      return `${product.options[0].price.toFixed(2)} €`;
    } else {
      const minPrice = Math.min(...product.options.map((opt) => opt.price));
      return `ab ${minPrice.toFixed(2)} €`;
    }
  };

  const formatProductName = (product: Product) => {
    if (product.options?.length === 1) {
      return (
        <View>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.optionName}>{product.options[0].name}</Text>
        </View>
      );
    }
    return <Text style={styles.productName}>{product.name}</Text>;
  };

  return (
    <View style={styles.productsContainer}>
      {showOptionPopup && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={true}
          onRequestClose={() => setShowOptionPopup(null)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowOptionPopup(null)}
          >
            <Pressable
              style={styles.modalContent}
              onPress={(e) => e.stopPropagation()} 
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{showOptionPopup.name}</Text>
                <TouchableOpacity onPress={() => setShowOptionPopup(null)} style={styles.closeButton}>
                  <FontAwesome6 name="x" iconStyle="solid" />
                </TouchableOpacity>
              </View>
              <View style={styles.modalBody}>
                {showOptionPopup.options?.map((option, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.optionButton}
                    onPress={() => handleOptionSelect(option)}
                  >
                    <Text style={styles.optionText}>{option.name}</Text>
                    <Text style={styles.optionPrice}>€{option.price.toFixed(2)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}

      <ScrollView contentContainerStyle={styles.productsGrid}>
        {products.map((product, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleProductClick(product)}
            style={styles.productButton}
          >
            <Text>{formatProductName(product)}</Text>
            <Text style={styles.productPrice}>{getPriceDisplay(product)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  productsContainer: {
    flex: 1,
    padding: 5
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productButton: {
    width: "33%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 18,
  },
  optionName: {
    fontSize: 16,
    color: "#666",
  },
  productPrice: {
    color: "green",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
  },
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
    width: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    marginTop: 10,
  },
  optionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
  },
  optionPrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
  optionDeposit: {
    fontSize: 12,
    color: "#666",
  },
});