import React from 'react';
import {Image} from 'react-native';
import styled from 'styled-components/native';
import {dynamicColor} from '../../utils';
import {font} from '../../utils/font';
import chevronForward from '../../assets/icons/chevron-forward.png';
import {FormattedDate} from 'react-intl';

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
const LabelWrap = styled.View<{color: 'primary' | 'danger'}>`
  padding: ${({theme}) => theme.spacing[1]}px;
  border-width: ${({theme}) => theme.border.width.standard}px;
  border-style: solid;
  border-radius: ${({theme}) => theme.border.radius.large};
  border-color: ${dynamicColor(
    ({theme, color}) => ({
      light: color === 'primary' ? theme.color.blue200 : theme.color.red200,
      dark:
        color === 'primary' ? theme.shades.dark.shade300 : theme.color.red400,
    }),
    true,
  )};

  background-color: ${props =>
    props.color === 'primary'
      ? 'transparent'
      : dynamicColor({
          light: props.theme.color.red100,
          dark: 'transparent',
        })};
`;

const Label = styled.Text<{color: 'primary' | 'danger'}>`
  ${font({
    fontWeight: '600',
    lineHeight: 16,
    fontSize: 12,
  })}

  color: ${dynamicColor(
    ({theme, color}) => ({
      light: color === 'primary' ? theme.color.blue400 : theme.color.red600,
      dark:
        color === 'primary' ? theme.shades.dark.shade700 : theme.color.red400,
    }),
    true,
  )};
`;

const Icon = styled.View`
  margin-left: auto;
`;

interface VehicleCardProps {
  title: string;
  color: string;
  number: string;
  image?: React.ReactNode;
  date: Date | null;
}

export function VehicleCard({
  title,
  color,
  number,
  image,
  date,
}: VehicleCardProps) {
  const isInspectionDeadline =
    (date ? differenceInMonths(new Date(date), new Date()) : 0) > 0;

  return (
    <Host>
      <Content>
        <Title>{title}</Title>
        <Text>
          {color} - {number}
        </Text>
        {date && (
          <LabelWrap color={isInspectionDeadline ? 'primary' : 'danger'}>
            <Label color={isInspectionDeadline ? 'primary' : 'danger'}>
              Næsta skoðun <FormattedDate value={date} />
            </Label>
          </LabelWrap>
        )}
      </Content>
      <Icon>
        <Image source={chevronForward} style={{width: 24, height: 24}} />
      </Icon>
    </Host>
  );
}
