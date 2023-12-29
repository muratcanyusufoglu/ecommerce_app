// ProductCard.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProductCard from '../ProductCard';


describe('ProductCard', () => {
  const mockProductDetails = {
    name: 'Mock Product',
    price: '20',
    image: 'https://example.com/mock-image.jpg',
  };

  it('renders correctly with product details', () => {
    const { getByText, getByTestId } = render(
      <ProductCard
        isFavorite={false}
        onAddToCart={() => {}}
        onPress={() => {}}
        productDetails={mockProductDetails}
      />
    );

    const productName = getByText('Mock Product');
    const productPrice = getByText('20₺');
    const addToCartButton = getByTestId('mock-QuickActionButton');

    expect(productName).toBeDefined();
    expect(productPrice).toBeDefined();
    expect(addToCartButton).toBeDefined();
  });

  it('calls onPress and onAddToCart functions when pressed', () => {
    const onPressMock = jest.fn();
    const onAddToCartMock = jest.fn();

    const { getByTestId } = render(
      <ProductCard
        isFavorite={false}
        onAddToCart={onAddToCartMock}
        onPress={onPressMock}
        productDetails={mockProductDetails}
      />
    );

    const addToCartButton = getByTestId('mock-QuickActionButton');
    fireEvent.press(addToCartButton);

    expect(onPressMock).toHaveBeenCalled();
    expect(onAddToCartMock).toHaveBeenCalledWith(mockProductDetails);
  });

  // Add more tests as needed
});
