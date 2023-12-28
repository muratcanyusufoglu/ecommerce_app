import {
  AppText,
  CartButtonWithIndicator,
  Spacer,
  ProductGridList,
} from '@app/components';
import {FlexContainer, MainContainer, PaddingContainer} from '@app/containers';
import {useCartStore} from '@app/store';
import {AppScreensParamsList, ProductType} from '@app/types';
import {AppColors} from '@app/utils';
import {
  showProductAddedToast,
  showProductRemovedToast,
} from '@app/utils/functions';
import {SearchIcon} from '@assets/svg';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {RefreshControl, StyleSheet, TextInput, View} from 'react-native';

type HomeScreenProps = BottomTabScreenProps<AppScreensParamsList, 'HomeScreen'>;

export default ({navigation}: HomeScreenProps): JSX.Element => {
  const [productList, setProductList] = useState<ProductType[]>();
  const [searchQuery, setSearchQuery] = useState('');
  const [pageNumber, setPageNumber] = useState<number>(1);

  // Function to update search query
  const handleSearch = (query: React.SetStateAction<string>) => {
    setSearchQuery(query);
  };

  const filteredProducts = productList?.filter((productList) =>
  productList.name.toLowerCase().includes(searchQuery.toLowerCase())
);

  const store = useCartStore();
  const isFocused = useIsFocused();

  const getProductsList = async () => {
    try {
      const res = await fetch('https://5fc9346b2af77700165ae514.mockapi.io/products');
      const data = await res.json();
      
      //serviste sayfa ayrımı yapılamadığından infinite scroll özelliği için manual ayrım yapıldı. 
      //Data 12'li olarak çekiliyormuş gibi ayrıldı.
      const start = 0;
      const end = pageNumber * 12;
      const cutData = data.slice(start,end)
      
      if (cutData.length) {
        const updatedProducts = cutData.map((product: ProductType) => {
          return {
            ...product,
            isFavorite: store.favorites.some(
              favorite => favorite.id === product.id
              ),
            };
          });
        setProductList(updatedProducts);
        setPageNumber(pageNumber + 1);
      }
    } catch (error) {
      console.error('Failed to get products list!', error);
    }
  };

  const navigateToProductDetails = (product: ProductType) => {
    navigation.navigate('ProductDetails', {product});
  };

  // This could have been a reusable function, but giving a function more than 2 params isn't a good practice, so repeating it makes sense.
  const handleOnAddToCart = (
    product: ProductType,
    isProductInCart: boolean
  ) => {
    if (isProductInCart) {
      store.removeFromCart(product.id);
      showProductRemovedToast(product.name);
    } else {
      showProductAddedToast(product.name);
      store.addToCart(product, 1);
    }
  };

  const ListHeaderComponent = (
    <>
      <View style={styles.extendedHeader}>
        <FlexContainer position="rowBetween" direction="row">
          <AppText
            style={{fontSize: 22}}
            color="PureWhite"
            fontFamily="ManropeSemiBold">
            E-Market
          </AppText>
          <CartButtonWithIndicator
            quantity={store.cart.length || 0}
            onPress={() => navigation.navigate('Cart')}
          />
        </FlexContainer>
        </View>
        <Spacer space={20} />
        <View style={styles.searchInput}>
          <SearchIcon height={18} width={18} />
          <Spacer space={12} between />
          <TextInput
            style={styles.textInput}
            placeholderTextColor={AppColors.GreyLightest}
            placeholder="Search"
            onChangeText={handleSearch}
          />
        </View>
        <Spacer space={20} />
      <Spacer space={27} />
      {filteredProducts?.length ? (
        <PaddingContainer style={{paddingVertical: 0}}>
          <Spacer space={20} />
        </PaddingContainer>
      ) : null}
    </>
  );

  useEffect(() => {
    getProductsList();
  }, [isFocused]);

  return (
    <MainContainer
      style={styles.container}
      backgroundColor={AppColors.PureWhite}
      fillHeight>
      <ProductGridList
        ListHeaderComponent={ListHeaderComponent}
        productList={filteredProducts?.length ? filteredProducts : []}
        fetchData={getProductsList}
        refreshControl={
          <RefreshControl
            refreshing={filteredProducts?.length === 0}
            onRefresh={getProductsList}
            tintColor={AppColors.PrimaryBlue}
          />
        }
        onAddToCart={handleOnAddToCart}
        onProductPress={navigateToProductDetails}
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  extendedHeader: {
    backgroundColor: AppColors.PrimaryBlue,
    padding: 20,
  },
  container: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  searchInput: {
    borderRadius: 100,
    backgroundColor: AppColors.Grey,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    height: 56,
    flex: 1,
    color: AppColors.PureWhite,
  },
});
