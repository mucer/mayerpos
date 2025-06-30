import { BluetoothManager, BluetoothEscposPrinter } from '@ccdilan/react-native-bluetooth-escpos-printer';
import { BluetoothEscposPrinter as BluetoothEscposPrinterTs } from '../models/bluetooth-escpos-printer';
import { CartItem } from '../models/cart-item';

const escposPrinter = BluetoothEscposPrinter as BluetoothEscposPrinterTs;

export class PrintService {

    async printBon(address: string, items: CartItem[]) {
        const conn = await BluetoothManager.connect(address);
        console.log(conn);
        await escposPrinter.setBlob(0);
        await escposPrinter.printerAlign(escposPrinter.ALIGN.LEFT);

        // print header with date: "Bon DD.MM.YYYY - HH:mm"
       // const now = new Date();
       // const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} - ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
       // this.printText(`Bon ${formattedDate}\n\n`);

        for (const item of items) {
            const text = `${item.quantity}x ${item.product.name}`
                + (item.option.name ? ` - ${item.option.name}` : '');
            this.printText(text+"\n")
            
        }
        await escposPrinter.printAndFeed(30)
    }


    private async printText(text: string) {
        await escposPrinter.printText(
            this.encodeToCP858(text)+"\n",
            { encoding: 'ISO-8859-1', heigthtimes: 1, widthtimes: 1 });
    }
    
   private encodeToCP858(text: string) {
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
}
