import React from 'react';
import {FormattedDate} from 'react-intl';
import {Image, ImageSourcePropType, ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import timeOutlineIcon from '../../assets/card/time-outline.png';
import {dynamicColor} from '../../utils/dynamic-color';
import {font} from '../../utils/font';
import {Avatar} from '../avatar/avatar';

const Host = styled.View`
  width: 100%;
  border-radius: ${({theme}) => theme.border.radius.large};
  border-width: ${({theme}) => theme.border.width.standard}px;
  border-color: ${dynamicColor(
    ({theme}) => ({
      dark: theme.shades.dark.shade300,
      light: theme.color.blue200,
    }),
    true,
  )};
  margin-bottom: ${({theme}) => theme.spacing[2]}px;
`;

const Content = styled.View`
  padding: ${({theme}) => theme.spacing[3]}px;
  justify-content: center;
  align-items: center;
`;

const Name = styled.Text`
  margin-top: ${({theme}) => theme.spacing[2]}px;
  margin-bottom: ${({theme}) => theme.spacing[1]}px;

  ${font({
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 26,
  })}
`;

const Ssn = styled.Text`
  ${font({
    fontWeight: '300',
    lineHeight: 24,
  })}
`;

const ActionsContainer = styled.View`
  border-top-width: ${({theme}) => theme.border.width.standard}px;
  border-top-color: ${dynamicColor(
    props => ({
      light: props.theme.color.blue200,
      dark: 'shade300',
    }),
    true,
  )};
  flex-direction: row;
`;

const ActionButton = styled.TouchableOpacity<{border: boolean}>`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({theme}) => theme.spacing[2]}px;
  border-left-width: ${({theme}) => theme.border.width.standard}px;
  border-left-color: ${dynamicColor(
    ({theme, border}) => (!border ? 'transparent' : theme.color.blue200),
    true,
  )};
`;

const ActionText = styled.Text`
  ${font({
    fontWeight: '600',
    color: ({theme}) => theme.color.blue400,
  })}
  text-align: center;
`;

interface UserCardProps {
  name?: string;
  ssn?: string;
  actions: Array<{text: string; onPress(): void}>;
}

export function UserCard({name, ssn, actions = []}: UserCardProps) {
  return (
    <Host>
      <Content>
        {name && <Avatar name={name} />}
        <Name>{name}</Name>
        <Ssn>{ssn}</Ssn>
      </Content>
      {actions.length ? (
        <ActionsContainer>
          {actions.map(({text, onPress}, i) => (
            <ActionButton onPress={onPress} key={i} border={i !== 0}>
              <ActionText>{text}</ActionText>
            </ActionButton>
          ))}
        </ActionsContainer>
      ) : null}
    </Host>
  );
}
