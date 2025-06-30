import { BluetoothEscposPrinter } from '@ccdilan/react-native-bluetooth-escpos-printer';
import { BluetoothEscposPrinter as BluetoothEscposPrinterTs } from '../models/bluetooth-escpos-printer';

const escposPrinter = BluetoothEscposPrinter as BluetoothEscposPrinterTs;

const encodeToCP858 = (text: string): string => {
    const cp858Map: { [key: string]: string } = {
        'Ä': '\x8E',
        'ä': '\x84',
        'Ö': '\x99',
        'ö': '\x94',
        'Ü': '\x9A',
        'ü': '\x81',
        'ß': '\xE1',
        '€': '\xEE',
    };

    return text.replace(/[ÄäÖöÜüß€]/g, c => cp858Map[c] || c);
}

const printText = async (text: string) => {
    await escposPrinter.printText(encodeToCP858(text), { encoding: 'ISO-8859-1' });
}

    const printLine = (text: string) => {
        console.log(text);
    };

    const cutPaper = () => {
        console.log("---------");
    };

    const printBon = () => {
        Object.entries(groupCartItemsBySection()).forEach(([section, items]) => {
            printLine(section);
            items.forEach((item) => {
                const optionText = item.option.name ? ` ${item.option.name}` : "";
                printLine(`${item.quantity}x ${item.product.name}${optionText}`);
            });
            cutPaper();
        });
    };

  const connect = async (device: Device) => {
    const conn = await BluetoothManager.connect(device.address);
    console.log(conn);
    await escposPrinter.setBlob(0);
    await escposPrinter.printerAlign(escposPrinter.ALIGN.LEFT);
    await printText("ÄÖÜäöüß€\n\r")
  }