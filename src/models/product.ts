export interface Product {
    name: string
    flat?: boolean,
    options: ProductOption[]
}

export interface ProductOption {
    name: string
    price: number
}