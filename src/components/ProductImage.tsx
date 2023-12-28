import { ProductType } from "@app/types";
import { AppColors } from "@app/utils";
import { LikeIcon } from "@assets/svg";
import { ImageBackground, ImageSourcePropType, StyleProp, ViewStyle } from "react-native";

type ProductImageProps = {
    isValidImage: boolean;
    source: ImageSourcePropType;
    style: StyleProp<ViewStyle>;
    isFavorite: boolean;
  };

const ProductImage = ({
    isValidImage,
    source,
    style,
    isFavorite,
  }: ProductImageProps) => (
    <ImageBackground
      resizeMode="contain"
      //borderRadius={PRODUCT_CARD_BORDER_RADIUS}
      source={source}
      style={style}>
      <LikeIcon
        style={{
          position: 'absolute',
          ...(isValidImage ? {top: 15, right: 15} : {top: 0, right: 90}),
        }}
        stroke={isFavorite ? 'none' : AppColors.GreyDark}
        fill={isFavorite ? AppColors.LightOrange : 'none'}
      />
    </ImageBackground>
  );

  export default ProductImage;