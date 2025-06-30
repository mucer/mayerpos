import { Product } from "./models/product";

export const products: Product[] = [
    {
        name: "Paar",
        flat: true,
        options: [
            { name: "im Papier", price: 4 },
            { name: "im Bröchten", price: 4.5 },
        ]
    },
    {
        name: "Messwurst",
        flat: true,
        options: [
            { name: "im Papier", price: 2 },
            { name: "im Bröchten", price: 2.5 },
        ]
    },
    {
        name: "3 Messwürste",
        options: [
            { name: "im Bröchten", price: 6.5 },
        ]
    },
    {
        name: "Brötchen",
        options: [
            { name: "", price: 0.5 }
        ]
    },
    {
        name: "Schaschlikpfanne",
        options: [
            { name: "", price: 8 }
        ]
    },
    {
        name: "Schnitzel",
        options: [
            { name: "", price: 6.5 },
            { name: "auf Brötchen", price: 7 },
            { name: "mit Salat", price: 11.5 },
            { name: "mit Pommes", price: 11 },
        ],
    },
    {
        name: "Hähnchenschnitzel",
        options: [
            { name: "", price: 4.5 },
            { name: "auf Brötchen", price: 5 },
            { name: "mit Salat", price: 9.5 },
            { name: "mit Pommes", price: 9 },
        ],
    },
    {
        name: "Currywurst",
        options: [
            { name: "", price: 6 },
            { name: "mit Pommes", price: 10 },
        ],
    },
    {
        name: "Steak",
        options: [
            { name: "", price: 6 },
            { name: "mit Salat", price: 11 },
            { name: "mit Pommes", price: 10.5 },
        ],
    },
    {
        name: "Pommes",
        options: [
            { name: "", price: 4.5, },
        ],
    },
    {
        name: "Weißwurst",
        options: [
            { name: "", price: 5.5 },
            { name: "mit Brezel", price: 7 },
        ],
    },
    {
        name: "Gemischter Salat",
        options: [
            { name: "", price: 5, },
        ],
    },
    {
        name: "Kartoffelsalat",
        options: [
            { name: "", price: 5, },
        ],
    },
    {
        name: "Emmentaler Käse",
        options: [
            { name: "100g", price: 3, },
        ],
    },
    {
        name: "Wurstsalat", 
        options: [
            { name: "mit Brötchen", price: 8 },
        ],
    },
    {
        name: "Frühstück",
        options: [
            { name: "klein", price: 6 },
            { name: "groß", price: 9 },
        ],
    },
    {
        name: "Tasse Kaffe",
        options: [
            { name: "", price: 2.5 },
        ],
    },
    {
        name: "Kuchen", 
        options: [
            { name: "", price: 3.5 },
        ],
    },
    {
        name: "Brezel", 
        options: [
            { name: "", price: 1.2 },
        ],
    },
]