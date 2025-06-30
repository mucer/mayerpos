export interface BluetoothEscposPrinter {
    ALIGN: {
      LEFT: number;
      CENTER: number;
      RIGHT: number;
    };
  
    printerInit(): Promise<void>;
  
    printAndFeed(feed: number): Promise<void>;
  
    printerLeftSpace(sp: number): Promise<void>;
  
    printerLineSpace(sp: number): Promise<void>;
  
    printerUnderLine(line: number): Promise<void>;
  
    printerAlign(align: number): Promise<void>;

    selfTest(callback?: (result: boolean) => void): Promise<void>;
  
    printText(
      text: string,
      options?: {
        encoding?: string;
        codepage?: number;
        widthtimes?: number;
        heigthtimes?: number;
        fonttype?: number;
      }
    ): Promise<void>;
  
    printColumn(
      columnWidths: number[],
      columnAligns: number[],
      columnTexts: string[],
      options: {
        encoding?: string;
        codepage?: number;
        widthtimes?: number;
        heigthtimes?: number;
        fonttype?: number;
      }
    ): Promise<void>;
  
    setWidth(width: number): Promise<void>;
  
    printPic(
      base64encodeStr: string,
      options: {
        width?: number;
        left?: number;
      }
    ): Promise<void>;
  
    setfTest(): Promise<void>;
  
    rotate(): Promise<void>;
  
    setBlob(weight: number): Promise<void>;
  
    printQRCode(
      content: string,
      size: number,
      correctionLevel: number
    ): Promise<void>;
  
    printBarCode(
      str: string,
      nType: number,
      nWidthX: number,
      nHeight: number,
      nHriFontType: number,
      nHriFontPosition: number
    ): Promise<void>;
  }