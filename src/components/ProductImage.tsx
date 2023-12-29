import { AppColors } from "../utils";
import { LikeIcon } from "../../assets/svg";
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
    </ImageBackground>
  );

  export default ProductImage;