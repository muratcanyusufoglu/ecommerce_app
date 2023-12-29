import {
  ACTIVE_BUTTON_OPACITY,
  PRODUCT_CARD_BORDER_RADIUS,
} from '../constants/index';
import {FlexContainer, PaddingContainer} from '../containers';
import {ProductType} from '../types';
import {AppColors} from '../utils';
import ProductFallbackImage from '../../assets/images/ProductFallbackImage.png';
import {DoneIcon, LikeIcon, PlusIcon} from '../../assets/svg';
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Dimensions
} from 'react-native';
import AppText from './AppText';
import QuickActionButton from './QuickActionButton';
import ProductImage from './ProductImage';

const window = Dimensions.get('window');

type ProductCardProps = {
  style?: ViewStyle;
  isFavorite: boolean;
  productDetails: ProductType | undefined;
  onPress: (product: ProductType) => void;
  onAddToCart: (product: ProductType) => void;
  isProductAddedToCart?: boolean;
};

export default ({
  isFavorite,
  onAddToCart,
  onPress,
  style,
  productDetails,
  isProductAddedToCart,
}: ProductCardProps): JSX.Element => {
  const isValidImage = productDetails?.image !== '';

  const imageSource = isValidImage
    ? {uri: productDetails?.image}
    : ProductFallbackImage;

  return (
    <TouchableOpacity
      activeOpacity={ACTIVE_BUTTON_OPACITY}
      onPress={() => productDetails && onPress(productDetails)}
      style={{
        ...styles.productCard,
        ...style,
      }}>
      <ProductImage
        isValidImage={isValidImage}
        source={imageSource}
        style={
          isValidImage
            ? {height: window.height/7, width: 'auto', borderRadius: 10, margin:5}
            : styles.productFallBackImage
        }
        isFavorite={isFavorite}
      />
      <PaddingContainer style={{justifyContent: 'space-evenly', flexDirection:'column'}}>
          <AppText fontSize="regular" color="PrimaryBlue">{`${
            productDetails?.price || 0
          }₺`}</AppText>
        <AppText fontSize="regular" color="LightGrey" style={styles.productName} numberOfLines={1}>
          {productDetails?.name || ''}
        </AppText>
          <QuickActionButton
            style={styles.addToCardButton}
            onPress={() => productDetails && onAddToCart(productDetails)}>
            {isProductAddedToCart ? (
              <AppText fontSize="regular" color="PureWhite" >Remove from Card</AppText>
              //<DoneIcon height={13} width={13} stroke={AppColors.PureWhite} />
            ) : (
              <AppText fontSize="regular" color="PureWhite" >Add to Card</AppText>
              //<PlusIcon height={13} width={13} fill={AppColors.PureWhite} />
            )}
          </QuickActionButton>
      </PaddingContainer>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    flex: 1,
    backgroundColor: AppColors.PureWhite,
    marginHorizontal: 17,
    marginBottom: 20,
    height: window.height/3.4,
    elevation: 5,
    borderWidth: 0.5,
  },
  addToCardButton: {
    height: '45%',
    width: '100%',
    backgroundColor: AppColors.PrimaryBlue,
  },
  productName: {
    width: '75%',
  },
  productFallBackImage: {
    height: 68,
    width: 68,
    alignSelf: 'center',
    marginTop: 20,
  },
});
