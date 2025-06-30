import { BluetoothManager } from '@ccdilan/react-native-bluetooth-escpos-printer';
import React, { useState } from 'react';
import { Button, DeviceEventEmitter, FlatList, ListRenderItemInfo, Switch, Text, View } from 'react-native';


interface Device {
  name: string;
  address: string;
}



const DeviceList = ({onConnect}: {onConnect: (address: string) => void}) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [bleEnabled, setBleEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // initial ble status
  BluetoothManager.isBluetoothEnabled().then(setBleEnabled)

  const handleDeviceAlreadyPairedEvent = (event: any) => {
    try {
      if (typeof(event.devices) == 'object') {
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
      if (typeof(event.device) == "object") {
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

  const renderPrinter = (item: ListRenderItemInfo<Device>) => (
    <View style={{ flexDirection: 'row', marginVertical: 10, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold' }}>{item.item.name || 'Unnamed Device'}</Text>
        <Text style={{ color: 'gray', marginBottom: 5 }}>{item.item.address}</Text>
      </View>
      <Button title="Connect" onPress={() => onConnect(item.item.address)} />
    </View>
  );

  const setScanResult = (r: any) => {
    console.log("Bluetooth enabled", r);
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

  const enableBle = async () => {
    console.log("Enabling Bluetooth");
    setLoading(true);
    try {
      const r = await BluetoothManager.enableBluetooth()
      setScanResult(r);

      setBleEnabled(true);
    } finally {
      setLoading(false);
    }
  };

  const disableBle = async () => {
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
    try {
      setLoading(true);

      const r = await BluetoothManager.scanDevices();
      setScanResult(r);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <Switch value={bleEnabled} onValueChange={(v) => v ? disableBle() : enableBle()} />
      <Text>Printers</Text>
      <FlatList
        data={devices}
        renderItem={renderPrinter}
        keyExtractor={(item) => item.address}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
      <Button disabled={loading || !bleEnabled} title="Refresh" onPress={discover} />
    </View>
  );
};

export default DeviceList;
