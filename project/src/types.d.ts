export type Taste = {
  text: string;
  bitter: number;
  sweetness: number;
  fruitAcid: number;
  body: number;
  roughness: number;
};

export type CategoryName =
  | "Rött vin"
  | "Vitt vin"
  | "Mousserande vin"
  | "Rosévin";

export type Wine = {
  nameBold: string;
  nameThin: string;
  producer: string;
  year: number;
  alcoholPercentage: number;
  volume: number;
  price: number;
  country: string;
  region: string;
  district: string;
  type: CategoryName;
  categoryTaste: string;
  usage: string;
  taste: Taste;
  url: string;
  imageURL: string;
  grapes: string[];
};

export type Wines = Wine[];

export type Categories = {
  [name in CategoryName]: number;
};

export type Country = {
  id: number;
  name: string;
  amountOfWines: number;
  wines?: Wine[];
  categories?: Categories;
};

export type Countries = {
  [name: string]: Country;
};

export type Grapes = {
  [name: string]: number;
};
