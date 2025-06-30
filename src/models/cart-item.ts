import { Product, ProductOption } from "./product";

export interface CartItem {
    id: string;
    product: Product;
    option: ProductOption;
    quantity: number;
}