import React from 'react';
import {Image, TouchableHighlightProps, View} from 'react-native';
import styled, {useTheme} from 'styled-components/native';
import {dynamicColor} from '../../utils';
import {font} from '../../utils/font';
import chevronForward from '../../assets/icons/chevron-forward.png';
import {Skeleton} from '../skeleton/skeleton';

interface ListButtonProps extends TouchableHighlightProps {
  title: string;
  isLoading?: boolean;
}

type HostProps = Omit<ListButtonProps, 'title'>;

const Host = styled.TouchableHighlight<HostProps>`
  padding-top: ${({theme}) => theme.spacing[3]}px;
  padding-bottom: ${({theme}) => theme.spacing[3]}px;
  padding-left: ${({theme}) => theme.spacing[2]}px;
  padding-right: ${({theme}) => theme.spacing[2]}px;

  border-bottom-width: 1px;
  border-color: ${dynamicColor(
    props => ({
      dark: 'shade500',
      light: props.theme.color.blue200,
    }),
    true,
  )};
`;

const Content = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Text = styled.Text<{isTransparent?: boolean; isOutlined?: boolean}>`
  ${font({
    fontWeight: '300',
  })}
`;
const Icon = styled.View`
  margin-left: auto;
`;

export function ListButton({title, isLoading, ...rest}: ListButtonProps) {
  const theme = useTheme();
  return (
    <Host underlayColor={theme.color.blue100} {...rest}>
      <Content>
        {isLoading ? (
          <View style={{width: 230}}>
            <Skeleton active={true} error={false} />
          </View>
        ) : (
          <Text>{title}</Text>
        )}
        {!isLoading && (
          <Icon>
            <Image source={chevronForward} style={{width: 24, height: 24}} />
          </Icon>
        )}
      </Content>
    </Host>
  );
}
