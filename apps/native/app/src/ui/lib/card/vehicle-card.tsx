import React from 'react';
import {Image} from 'react-native';
import styled from 'styled-components/native';
import {dynamicColor} from '../../utils';
import {font} from '../../utils/font';
import chevronForward from '../../assets/icons/chevron-forward.png';
import {FormattedDate} from 'react-intl';
import warning from '../../assets/alert/warning.png';

function differenceInMonths(a: Date, b: Date) {
  return a.getMonth() - b.getMonth() + 12 * (a.getFullYear() - b.getFullYear());
}

const Host = styled.View`
  display: flex;
  flex-direction: row;
  padding: ${({theme}) => theme.spacing[3]}px;
  padding-right: ${({theme}) => theme.spacing[1]}px;
  border-radius: ${({theme}) => theme.border.radius.large};
  border-width: ${({theme}) => theme.border.width.standard}px;
  border-color: ${dynamicColor(
    ({theme}) => ({
      light: theme.color.blue200,
      dark: theme.shades.dark.shade300,
    }),
    true,
  )};
  align-items: center;
  justify-content: space-between;
`;

const Content = styled.View`
  flex: 1;
  align-items: flex-start;
`;

const Title = styled.Text`
  padding-right: ${({theme}) => theme.spacing[1]}px;
  margin-bottom: ${({theme}) => theme.spacing[1]}px;

  ${font({
    fontWeight: '600',
    lineHeight: 24,
    fontSize: 18,
  })}
`;

const Text = styled.Text`
  padding-right: ${({theme}) => theme.spacing[2]}px;
  margin-bottom: ${({theme}) => theme.spacing[2]}px;

  ${font({
    fontWeight: '300',
    lineHeight: 24,
    fontSize: 16,
  })}
`;
const LabelWrap = styled.View<{color: 'primary' | 'danger' | 'warning'}>`
  padding: ${({theme}) => theme.spacing[1]}px;
  flex-direction: row;
  align-items: center;
  border-width: ${({theme}) => theme.border.width.standard}px;
  border-style: solid;
  border-radius: ${({theme}) => theme.border.radius.large};
  border-color: ${dynamicColor(
    ({theme, color}) => ({
      light:
        color === 'primary'
          ? theme.color.blue200
          : color === 'danger'
          ? theme.color.red200
          : theme.color.yellow400,
      dark:
        color === 'primary'
          ? theme.shades.dark.shade300
          : color === 'danger'
          ? theme.color.red400
          : theme.color.yellow400,
    }),
    true,
  )};

  background-color: ${props =>
    props.color === 'primary'
      ? 'transparent'
      : dynamicColor({
          light:
            props.color === 'danger'
              ? props.theme.color.red100
              : props.theme.color.yellow200,
          dark: 'transparent',
        })};
`;

const Label = styled.Text<{color: 'primary' | 'danger' | 'warning'}>`
  ${font({
    fontWeight: '600',
    lineHeight: 16,
    fontSize: 12,
  })}

  color: ${dynamicColor(
    ({theme, color}) => ({
      light:
        color === 'primary'
          ? theme.color.blue400
          : color === 'danger'
          ? theme.color.red600
          : theme.shade.foreground,
      dark:
        color === 'primary'
          ? theme.shades.dark.shade700
          : color === 'danger'
          ? theme.color.red400
          : theme.shade.foreground,
    }),
    true,
  )};
`;

const Icon = styled.View`
  margin-left: auto;
`;

interface VehicleCardProps {
  title?: string | null;
  color?: string | null;
  number?: string | null;
  label?: React.ReactNode;
}

export function VehicleCard({title, color, number, label}: VehicleCardProps) {
  return (
    <Host>
      <Content>
        <Title>{title}</Title>
        <Text>
          {color} - {number}
        </Text>
        {label}
      </Content>
      <Icon>
        <Image source={chevronForward} style={{width: 24, height: 24}} />
      </Icon>
    </Host>
  );
}
