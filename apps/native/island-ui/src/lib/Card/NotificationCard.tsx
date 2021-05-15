import React from 'react'
import styled, { useTheme } from 'styled-components/native';
import { theme } from '@island.is/island-ui/theme';
import { FormattedDate } from 'react-intl';
import { Text, Image } from 'react-native';
import { ImageSourcePropType } from 'react-native';


const Host = styled.TouchableHighlight`
  border-radius: ${props => theme.border.radius.large};
  background-color: ${props => props.theme.isDark ? props.theme.shade.shade100 : props.theme.color.blueberry100};
  margin-bottom: 16px;
`;

const Container = styled.View`
  padding-top: 20px;
`;

const Title = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  padding-right: 8px;
`;

const ActionsContainer = styled.View`
  border-top-width: 1px;
  border-top-color: ${props => props.theme.isDark ? props.theme.shade.shade200 : props.theme.color.blueberry200};
  flex-direction: row;
`;

const ActionButton = styled.TouchableOpacity<{ border: boolean }>`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-left-width: 1px;
  border-left-color: ${props => props.border ? props.theme.isDark ? props.theme.shade.shade200 : props.theme.color.blueberry200 : 'transparent'};
`;

const ActionText = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 16px;
  line-height: 20px;
  color: ${theme.color.blue400};
  text-align: center;
`;

const TitleText = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 13px;
  line-height: 17px;
  color: ${props => props.theme.shade.foreground};
  flex: 1;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
  padding-left: 16px;
  padding-right: 16px;
`;

const Date = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DateText = styled.Text<{ unread?: boolean }>`
  font-family: ${props => props.unread ? 'IBMPlexSans-SemiBold' : 'IBMPlexSans-Light'};
  font-size: 13px;
  line-height: 17px;
  color: ${props => props.theme.shade.foreground};
`;

const Content = styled.View`
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 16px;
`;

const Message = styled.Text`
  font-family: 'IBMPlexSans-Light';
  color: ${props => props.theme.shade.foreground};
  font-size: 16px;
  line-height: 24px;
`;

const Dot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.theme.color.blueberry400};
  margin-left: 8px;
`;

interface CardProps {
  id: string;
  icon: ImageSourcePropType;
  date: Date;
  title: string;
  message: string;
  unread?: boolean;
  actions?: Array<{ text: string; onPress(): void }>;
  onPress(id: string): void;
}

export function NotificationCard({ id, onPress, title, message, date, icon, unread, actions = [] }: CardProps) {
  const theme = useTheme();
  return (
    <Host
      onPress={() => onPress(id)}
      underlayColor={theme.isDark ? theme.shade.shade200 : '#EBEBFA'}
    >
      <Container>
      <Row>
        <Title>
          {icon && <Image source={icon} style={{ width: 16, height: 16, marginRight: 8 }} />}
          <TitleText numberOfLines={1} ellipsizeMode="tail">
            {title}
          </TitleText>
        </Title>
        <Date>
          <DateText unread={unread}>
            <FormattedDate value={date} />
          </DateText>
          {unread && <Dot />}
        </Date>
      </Row>
      <Content>
        <Message>{message}</Message>
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
      </Container>
    </Host>
  )
}
