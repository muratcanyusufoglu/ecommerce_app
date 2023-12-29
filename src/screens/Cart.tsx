import {
  AppButton,
  AppText,
  CartProductQuantitySelector,
  QuickActionButton,
  Spacer,
} from '../components';
import {FlexContainer, MainContainer, PaddingContainer} from '../containers';
import {useCartStore} from '../store';
import {AppScreensParamsList} from '../types';
import {AppColors} from '../utils';
import {ArrowIcon} from '../../assets/svg';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {ScrollView, StyleSheet, View} from 'react-native';

const RenderOrderDetailsText = ({
  title,
  value,
}: {
  title: string;
  value: number;
}): JSX.Element => {
  return (
    <>
      <FlexContainer direction="column" position="columnBetween">
        <AppText color="DarkBlue">{title}</AppText>
        <AppText color="GreyDark" fontFamily="ManropeMedium">
          {`${value || 0}₺`}
        </AppText>
      </FlexContainer>
      <Spacer space={13} />
    </>
  );
};

type CartScreenProps = BottomTabScreenProps<AppScreensParamsList, 'Cart'>;

export default ({navigation}: CartScreenProps) => {
  const store = useCartStore();

  const isCartEmpty = store.cart.length === 0;

  const getTotalCartPrice = (): number => {
    const totalCartPrice = store.cart.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);

    return totalCartPrice;
  };

  return (
    <MainContainer style={{paddingHorizontal: 0}} fillHeight>
      <PaddingContainer>
        <FlexContainer direction="row" position="rowBetween" style={{borderRadius: 10}}>
          <FlexContainer direction="row" position="start">
          <QuickActionButton onPress={navigation.goBack}>
            <ArrowIcon fill={AppColors.GreyDark} />
          </QuickActionButton>
          <AppText fontSize='large'>E-Market</AppText>
          </FlexContainer>
          <AppText fontSize='large'>{`Shopping Cart (${store.cart.length || 0})`}</AppText>
        </FlexContainer>
      </PaddingContainer>
      {isCartEmpty ? (
        <View style={styles.noItemsIndicator}>
          <AppText fontSize="extraLarge">
            Uh oh, Looks like you haven't shopped anything!
          </AppText>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <PaddingContainer style={{paddingVertical: 0}}>
            <Spacer space={30} />
            {store.cart.map(({product}, index) => {
              const isLastProduct = store.cart.length - 1 === index;
              return (
                <CartProductQuantitySelector
                  isLastProduct={isLastProduct}
                  key={product.id}
                  productDetails={product}
                />
              );
            })}
          </PaddingContainer>
        </ScrollView>
      )}

      {!isCartEmpty ? (
        <PaddingContainer style={styles.checkoutView}>
          <FlexContainer position="rowBetween" direction='row'>
          <RenderOrderDetailsText
            title="Total"
            value={getTotalCartPrice()}
          />
          <AppButton onPress={() => alert('Handle checkout!')}>
            Complete
          </AppButton>
          </FlexContainer>
        </PaddingContainer>
      ) : null}
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  checkoutView: {
    backgroundColor: AppColors.LightWhite,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  noItemsIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
