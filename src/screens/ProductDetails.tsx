import {
  AppButton,
  AppText,
  CartButtonWithIndicator,
  QuickActionButton,
  Spacer,
} from '../components';
import ProductImage from '../components/ProductImage';
import {FlexContainer, MainContainer, PaddingContainer} from '../containers';
import {useCartStore} from '../store';
import {AppScreensParamsList, ProductType} from '../types';
import {AppColors} from '../utils';
import {
  showProductAddedToast,
  showProductRemovedToast,
  showToast,
} from '../utils/functions';
import {ArrowIcon, HeartIcon} from '../../assets/svg';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Vibration,
  View,
} from 'react-native';
import ProductFallbackImage from '../../assets/images/ProductFallbackImage.png';

const window = Dimensions.get('window');
const PriceAndDiscountIndicator = ({
  price,
}: {
  price: number;
}): JSX.Element => {
  return (
    <FlexContainer position="start" direction="row">
      <AppText color="PrimaryBlue" fontFamily="ManropeBold">{`${
        price || 0
      }₺`}</AppText>
      <Spacer space={10} between />
    </FlexContainer>
  );
};

type ProductDetailsScreenProps = BottomTabScreenProps<
  AppScreensParamsList,
  'ProductDetails'
>;

export default ({navigation, route}: ProductDetailsScreenProps) => {
  const {id: productId} = route.params && route.params.product;
  const store = useCartStore();

  const [productDetails, setProductDetails] = useState<ProductType>();
  const isFocused = useIsFocused();

  const isProductInCart = store.cart.length
    ? store.cart.some(product => product.product.id === productDetails?.id)
    : false;

  const getProductDetails = async (productId: number) => {
    if (productId) {
      try {
        const res = await fetch(`https://5fc9346b2af77700165ae514.mockapi.io/products/${productId}`);
        const productData = await res.json();

        if (
          Object.keys(productData).length &&
          Object.hasOwn(productData, 'id')
        ) {
          const updatedProductDetails: ProductType = {
            ...productData,
            isFavorite: store.favorites.some(
              favorite => favorite.id === productData.id
            ),
          };
          setProductDetails(updatedProductDetails);
        }
      } catch (error) {
        console.error('Failed to get product details!', error);
      }
    }
  };

  const handleAddToCart = () => {
    if (productDetails) {
      if (isProductInCart) {
        store.removeFromCart(productDetails.id);
        showProductRemovedToast(productDetails.name);
      } else {
        showProductAddedToast(productDetails.name);
        store.addToCart(productDetails, 1);
      }
    }
  };

  const handleOnBuyNow = () => {
    if (productDetails) {
      store.addToCart(productDetails, 1);
      navigation.navigate('Cart');
    }
  };

  const isProductLoaded =
    productDetails &&
    !!productDetails?.id &&
    !!productDetails.name &&
    !!productDetails.price;

  const isProductInFavorites = useMemo(() => {
    if (productDetails) {
      return store.favorites.some(product => product.id === productDetails.id);
    }
  }, [store.favorites.length, productDetails?.isFavorite]);

  const handleOnFavorite = () => {
    if (productDetails) {
      if (isProductInFavorites) {
        store.removeFromFavorites(productDetails.id);
      } else {
        store.addToFavorites(productDetails);
        Vibration.vibrate(5);
        showToast(
          'Added to favorites',
          `${productDetails.name} has been added to your favorites!`
        );
      }
    }
  };

  useEffect(() => {
    getProductDetails(productId);
  }, [isFocused, isProductInFavorites]);

  const isValidImage = productDetails?.image !== '';

  const imageSource = isValidImage
    ? {uri: productDetails?.image}
    : ProductFallbackImage;

  return (
    <MainContainer style={{paddingHorizontal: 0}} fillHeight>
      <PaddingContainer style={{backgroundColor: AppColors.PrimaryBlue}}>
        <FlexContainer direction="row" position="rowBetween">
          <QuickActionButton onPress={navigation.goBack}>
            <ArrowIcon fill={AppColors.GreyDark} height={12} width={12} />
          </QuickActionButton>
          <AppText fontSize='large' color='PureWhite'>
                {productDetails?.name}
              </AppText>
          <CartButtonWithIndicator
            quantity={store.cart.length || 0}
            onPress={() => navigation.navigate('Cart')}
            cartIconColor={AppColors.PureWhite}
          />
        </FlexContainer>
      </PaddingContainer>
      <Spacer space={10} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => getProductDetails(productId)}
            tintColor={AppColors.PrimaryBlue}
          />
        }>
        {isProductLoaded ? (
          <View>
            <PaddingContainer>
              <Spacer space={10} />
            </PaddingContainer>
            <QuickActionButton
                  onPress={handleOnFavorite}
                  style={styles.favoriteButton}>
                  <HeartIcon
                    height={27}
                    width={27}
                    stroke={
                      productDetails.isFavorite ? 'none' : AppColors.GreyDark
                    }
                    fill={
                      productDetails.isFavorite ? AppColors.LightOrange : 'none'
                    }
                  />
                </QuickActionButton>
            <ProductImage
              isValidImage={productDetails?.image !== ''}
              source={imageSource}
              style={
                isValidImage
                  ? {height: window.height/3, width: 'auto', borderRadius: 10, margin:5}
                  : styles.productFallBackImage
              }
              isFavorite={productDetails.isFavorite}
            />
            <Spacer space={26} />
            <PaddingContainer>              
              <AppText fontSize='large'>
                {productDetails?.name}
              </AppText>              
              <Spacer space={6} />
              <AppText color="GreyLightest">
                {productDetails.description || ''}
              </AppText>
              <Spacer space={20} />
              <FlexContainer direction="row" position="rowBetween">
                <FlexContainer direction="column" position="start">
                  <AppText color="PrimaryBlue">
                  Price:
                  </AppText>
                  <PriceAndDiscountIndicator
                  price={productDetails.price}
                  />
                </FlexContainer>
                <AppButton
                  style={styles.addToCartButton}
                  onPress={handleAddToCart}
                  color="PrimaryBlue">
                  {isProductInCart ? 'Remove From Cart' : 'Add To Cart'}
                </AppButton>
                <Spacer space={20} between />
              </FlexContainer>
            </PaddingContainer>
          </View>
        ) : (
          <ActivityIndicator color={AppColors.PrimaryBlue} />
        )}
      </ScrollView>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  discountTextHolder: {
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderRadius: 100,
    backgroundColor: AppColors.PrimaryBlue,
  },
  addToCartButton: {
    borderWidth: 1,
    borderColor: AppColors.PrimaryBlue,
    backgroundColor: undefined,
    flex: 1,
  },
  favoriteButton: {
    borderRadius: 20,
    backgroundColor: AppColors.PureWhite,
    height: 53,
    width: 53,
  },
  favoriteButtonHolder: {
    position: 'absolute',
    zIndex: 1,
    right: 20,
    top: 20,
  },
  productFallBackImage: {
    height: 68,
    width: 68,
    alignSelf: 'center',
    marginTop: 20,
  },
});
