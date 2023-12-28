type AppScreensParamsList = {
  HomeScreen: undefined;
  CategoriesScreen: undefined;
  FavoritesScreen: undefined;
  MoreScreen: undefined;
  ProductDetails: {product: ProductType};
  Cart: undefined;
  BottomNavBar: undefined;
};

type ProductType = {
  id: number;
  brand: string;
  model: string;
  description: string;
  price: number;
  image: string;
  name: string;
  createdAt: string;
  isFavorite: boolean;
};

type ProductsList = ProductType[];

export type {AppScreensParamsList, ProductType, ProductsList};
