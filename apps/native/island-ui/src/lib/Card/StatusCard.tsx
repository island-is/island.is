import React from 'react'
import styled from 'styled-components/native';
import { theme } from '@island.is/island-ui/theme';
import { FormattedDate } from 'react-intl';
import { Text } from 'react-native';
import { ImageSourcePropType } from 'react-native';
import { Image } from 'react-native';

const Host = styled.View`
  border-radius: ${theme.border.radius.large};
  border-width: 1px;
  border-color: ${props => props.theme.color.blue200};
  margin-bottom: 16px;
`;

const ActionsContainer = styled.View`
  border-top-width: 1px;
  border-top-color: ${props => props.theme.color.blue200};
  flex-direction: row;
`;

const ActionButton = styled.TouchableOpacity<{ border: boolean }>`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-left-width: 1px;
  border-left-color: ${props => props.border ? props.theme.color.blue200 : 'transparent'};
`;

const ActionText = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 16px;
  line-height: 20px;
  color: ${theme.color.blue400};
  text-align: center;
`;

// const ActionButton = styled.TouchableOpacity`
//   padding: 16px;
//   text-align: center;
// `;
// const ActionText = styled.Text`
//   font-family: 'IBMPlexSans-SemiBold';
//   font-size: 16px;
//   line-height: 20px;
//   color: ${theme.color.blue400};
//   text-align: center;
// `;

const Title = styled.Text`
  margin-bottom: 8px;
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 13px;
  line-height: 17px;
  color: ${theme.color.dark400};
`;

const Description = styled.Text`
  font-family: 'IBMPlexSans-Light';
  font-size: 16px;
  line-height: 24px;
  color: ${theme.color.dark400};
`;

const Content = styled.View`
  padding: 16px;
  padding-top: 0px;
`;

const Date = styled.View`
  flex-direction: row;
  align-items: center;
  /* height: 40px; */
`;

const DateText = styled.Text`
  font-family: 'IBMPlexSans-Light';
  font-size: 13px;
  line-height: 17px;
  color: ${theme.color.dark400};
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
`;

const Bar = styled.View`
  height: 12px;
  overflow: hidden;
  background-color: ${theme.color.roseTinted200};
  border-radius: 6px;
  padding: 2px;

  margin-top: 16px;
`;

const Progress = styled.View<{ width?: number}>`
  flex: 1;
  width: ${(props: any) => props.width ?? 0}%;
  border-radius: 6px;

  background-color: ${theme.color.roseTinted400};
`;

interface StatusCardProps {
  title: string;
  description: string;
  date: Date;
  icon?: ImageSourcePropType;
  badge?: React.ReactNode;
  progress?: number;
  actions: Array<{ text: string; onPress(): void }>;
}

export function StatusCard({ title, description, date, badge, progress, icon, actions = [] }: StatusCardProps) {
  return (
    <Host>
      <Row>
        <Date>
          {icon && <Image source={icon} style={{ width: 16, height: 16, marginRight: 4 }} />}
          <DateText><FormattedDate value={date} /></DateText>
        </Date>
        {badge}
      </Row>
      <Content>
        <Title>
          {title}
        </Title>
        <Description>
          {description}
        </Description>
        <Bar>
          <Progress width={progress} />
        </Bar>
      </Content>
      {actions.length ? (
        <ActionsContainer>
          {actions.map(({ text, onPress }, i) => (
            <ActionButton onPress={onPress} key={i} border={i !== 0}>
              <ActionText>{text}</ActionText>
            </ActionButton>
          ))}
        </ActionsContainer>
      ) : null}
    </Host>
  )
}
