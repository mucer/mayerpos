import { BluetoothManager } from '@ccdilan/react-native-bluetooth-escpos-printer';
import React, { useState } from 'react';
import { Alert, Button, DeviceEventEmitter, FlatList, Linking, ListRenderItemInfo, Modal, PermissionsAndroid, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

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

interface Device {
  name: string;
  address: string;
}

interface DeviceModalProps {
  close: () => void;
  onSelect: (address: string) => void;
}

export const DeviceModal = ({ close, onSelect }: DeviceModalProps) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [bleEnabled, setBleEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // initial ble status
  BluetoothManager.isBluetoothEnabled().then(setBleEnabled)

  const handleDeviceAlreadyPairedEvent = (event: any) => {
    try {
      if (typeof (event.devices) == 'object') {
        addDevices(event.devices);
      } else {
        addDevices(JSON.parse(event.devices));
      }
    } catch (e) {
      console.error("Error handling device already paired event", event, e);
    }
  }

  const handleDeviceFoundEvent = (event: any) => {
    try {
      if (typeof (event.device) == "object") {
        addDevices([event.device]);
      } else {
        addDevices([JSON.parse(event.device)]);
      }
    } catch (e) {
      console.error("Error handling device found event", event, e);
    }
  }

  const addDevices = (d: Device[]) => {
    const newDevices = d.filter(device => devices.every(d => d.address !== device.address));

    if (newDevices.length) {
      setDevices([...devices, ...newDevices]);
    }
  };

  DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, handleDeviceAlreadyPairedEvent);
  DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, handleDeviceFoundEvent);


  const setScanResult = (r: any) => {
    console.log("setScanResult", r);
    var paired = [];
    if (r && r.length > 0) {
      for (var i = 0; i < r.length; i++) {
        try {
          paired.push(JSON.parse(r[i]));
        } catch (e) {
          //ignore
        }
      }
    }
  }

  const enableBluetooth = async () => {
    console.log("enableBluetooth");
    setLoading(true);
    try {
      const r = await BluetoothManager.enableBluetooth()
      setScanResult(r);

      setBleEnabled(true);
    } finally {
      setLoading(false);
    }
  };

  const disableBluetooth = async () => {
    console.log("disableBluetooth");
    try {
      setLoading(true)

      await BluetoothManager.disableBluetooth()
      setBleEnabled(false);
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  const discover = async () => {
    console.log("discover");

    const hasPermissions = await handleAndroidPermissions();
    if (!hasPermissions) {
      return;
    }

    try {
      setLoading(true);

      const r = await BluetoothManager.scanDevices();
      setScanResult(r);
    } finally {
      setLoading(false);
    }
  }

  const selectDevice = (address: string) => {
    onSelect(address);
    close();
  }

  const renderDevice = (item: ListRenderItemInfo<Device>) => (
    <View style={{ flexDirection: 'row', marginVertical: 10, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold' }}>{item.item.name || 'Unnamed Device'}</Text>
        <Text style={{ color: 'gray', marginBottom: 5 }}>{item.item.address}</Text>
      </View>
      <Button title="Auswählen" onPress={() => selectDevice(item.item.address)} />
    </View>
  );

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
          <Switch value={bleEnabled} onValueChange={(v) => v ? disableBluetooth() : enableBluetooth()} />
          <Text>Printers</Text>
          <FlatList
            data={devices}
            renderItem={renderDevice}
            keyExtractor={(item) => item.address}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />
          <Button disabled={loading || !bleEnabled} title="Refresh" onPress={discover} />
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
});

