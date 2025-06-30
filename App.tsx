import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  PermissionsAndroid,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import { Cart } from './src/components/cart.component';
import { ProductList } from './src/components/product-list.component';
import { products } from './src/data';
import { CartProvider } from './src/providers/cart.provider';
import { ModalComponent } from './src/components/modal.component';

const handleAndroidPermissions = async () => {
  const result = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  ]);
  console.debug('permissions', result);

  const hasBluetoothScan = result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED;
  const hasBluetoothConnect = result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED;
  const hasPermissions = hasBluetoothScan && hasBluetoothConnect;


  if (!hasPermissions) {
    Alert.alert(
      "Permission Required",
      "Bluetooth Scan permission is required. Please enable it manually in your device settings.",
      [{ text: "OK", onPress: () => Linking.openSettings() }]
    );
    return false;
  } else {
    return true;
  }
};

function App(): React.JSX.Element {
  //handleAndroidPermissions();

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View style={[backgroundStyle, { flex: 1 }]}>
      <CartProvider>
        {/* Navigation Bar */}
        <View style={{ flexDirection: 'row', padding: 16, backgroundColor: Colors.primary }}>
          <Text style={{ flex: 1, fontSize: 20, fontWeight: 'bold', color: Colors.white }}>Kasse</Text>
          <TouchableOpacity>
            <Text style={{ fontSize: 20, color: Colors.white }}>Menu</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <ProductList products={products} />
          </View>
          <View style={{ width: 400 }}>
            <Cart />
          </View>
        </View>
      </CartProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
export default App;
