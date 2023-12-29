import {AppText, CartButtonWithIndicator, Spacer} from '../components';
import {ACTIVE_BUTTON_OPACITY, TAB_ICON_SIZE} from '../constants';
import {FlexContainer} from '../containers';
import {
  CartScreen,
  FavoritesScreen,
  HomeScreen,
  MoreScreen,
} from '../screens';
import {AppScreensParamsList} from '../types';
import {AppColors, isAndroid} from '../utils';
import {
  CartIcon,
  HeartIcon as FavoritesIcon,
  HomeIcon,
  ThreeVerticalDotsIcon as MoreIcon,
} from '../../assets/svg';
import {
  BottomTabBarProps,
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useCartStore} from '../store';

const BottomTab = createBottomTabNavigator<AppScreensParamsList>();

type TabIconProps = {
  isFocused: boolean;
  index: number;
  label: string;
};

const bottomNavIcons = [HomeIcon, CartIcon, FavoritesIcon, MoreIcon];

const RenderTabIcon = ({isFocused, index, label}: TabIconProps) => {
  const BottomTabIcon = bottomNavIcons[index];
  const store = useCartStore();

  return (
    <FlexContainer position="center">
      {index == 1 ? 
      <CartButtonWithIndicator
      cartIconColor={AppColors.GreyDark}
      quantity={store.cart.length || 0}
      onPress={undefined}/> : null}
      {index != 1 ? <BottomTabIcon
        fill={isFocused ? AppColors.PrimaryYellow : 'none'}
        stroke={isFocused ? 'none' : AppColors.GreyDark}
        height={TAB_ICON_SIZE}
        width={TAB_ICON_SIZE}
      /> : null}
      <Spacer space={1} />
      <AppText fontSize="small" color="LightGrey" style={{textAlign: 'center'}}>
        {label}
      </AppText>
    </FlexContainer>
  );
};

const BottomTabBar = ({state, navigation}: BottomTabBarProps) => {
  return (
    <View style={styles.bottomTab}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const tabBarLabel =
          route.name === 'HomeScreen'
            ? 'Home'
            : route.name === 'Cart'
            ? 'Cart'
            : route.name === 'FavoritesScreen'
            ? 'Favorites'
            : 'More';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved.
            navigation.navigate(route.name, {merge: true});
          }
        };
        return (
          <TouchableOpacity
            activeOpacity={ACTIVE_BUTTON_OPACITY}
            key={route.key}
            onPress={onPress}
            style={styles.tabIcon}>
            <RenderTabIcon
              isFocused={isFocused}
              index={index}
              label={tabBarLabel}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const bottomTabScreenOptions: BottomTabNavigationOptions = {
  tabBarHideOnKeyboard: true,
  headerShown: false,
};

const initialRouteName: keyof AppScreensParamsList = 'HomeScreen';

export default () => {
  return (
    <BottomTab.Navigator
      initialRouteName={initialRouteName}
      detachInactiveScreens
      tabBar={props => <BottomTabBar {...props} />}>
      <BottomTab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={bottomTabScreenOptions}
      />
      <BottomTab.Screen
        name="Cart"
        component={CartScreen}
        options={bottomTabScreenOptions}
      />
      <BottomTab.Screen
        name="FavoritesScreen"
        component={FavoritesScreen}
        options={bottomTabScreenOptions}
      />
      <BottomTab.Screen
        name="MoreScreen"
        component={MoreScreen}
        options={bottomTabScreenOptions}
      />
    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    padding: 10,
  },
  bottomTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    backgroundColor: AppColors.PureWhite,
    borderTopWidth: 0,
    height: isAndroid ? 70 : 85,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
});
