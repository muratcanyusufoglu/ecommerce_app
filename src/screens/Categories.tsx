import {AppText} from '../components';
import {FlexContainer, MainContainer} from '../containers';
import {AppColors} from '../utils';
import React from 'react';

export default (): JSX.Element => {
  return (
    <MainContainer backgroundColor={AppColors.PureWhite} fillHeight>
      <FlexContainer position="center" fillHeight>
        <AppText>Categories</AppText>
      </FlexContainer>
    </MainContainer>
  );
};
