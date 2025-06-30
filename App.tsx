import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  PermissionsAndroid,
  Pressable,
  SafeAreaView,
  SafeAreaViewBase,
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
import { CartItem } from './src/models/cart-item';
import { DeviceModal } from './src/components/device.modal';
import { PrintService } from './src/service/print.service';

const printService = new PrintService()

function App(): React.JSX.Element {
  //handleAndroidPermissions();

  const isDarkMode = useColorScheme() === 'dark';
  const [deviceAddress, setDeviceAddress] = useState<string | null>(null);
  const [showDevicePopup, setShowDevicePopup] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const print = async (items: CartItem[]) => {
    if (!deviceAddress) {
      setShowDevicePopup(true)
      return false

    }
    if (items.length) {
      await printService.printBon(deviceAddress, items)
    }
    return true
  };

  return (
    <View style={[backgroundStyle, { flex: 1 }]}>
      {showDevicePopup && (
        <DeviceModal
          onSelect={setDeviceAddress}
          close={() => setShowDevicePopup(false)} />)}
      <CartProvider>
        <View style={{ flexDirection: 'row', paddingTop: 30, backgroundColor: Colors.primary }}>
          <Text style={{ flex: 1, padding: 12, fontSize: 20, fontWeight: 'bold', color: Colors.white }}>Bons</Text>
          <TouchableOpacity style={{ padding: 12 }} onPress={() => setShowDevicePopup(true)}>
            <FontAwesome6 name="bars" iconStyle="solid" color="white" size={20} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <ProductList products={products} />
          </View>
          <View style={{ width: 400 }}>
            <Cart print={print} />
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
