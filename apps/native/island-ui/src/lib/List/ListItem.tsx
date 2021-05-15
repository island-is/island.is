import React from 'react'
import { theme } from '@island.is/island-ui/theme';
import styled from 'styled-components/native';
import { ImageSourcePropType } from '../../../../../../node_modules/@types/react-native';
import { FormattedDate } from 'react-intl';

const Host = styled.SafeAreaView`
  margin-right: 16px;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.isDark ? props.theme.shade.shade100 : props.theme.color.blue100};
`

const Icon = styled.View`
  padding: 22px;
  align-items: center;
  justify-content: center;
`

const Logo = styled.Image`
  width: 24px;
  height: 24px;
`

const Content = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 8px;
  padding-top: 16px;
`

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 8px;
`

const Title = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  padding-right: 8px;
`

const TitleText = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 13px;
  line-height: 17px;
  color: ${(props) => props.theme.shade.foreground};
  flex: 1;
`

const Date = styled.View`
  flex-direction: row;
  align-items: center;
`

const DateText = styled.Text<{ unread?: boolean }>`
  font-family: ${(props) =>
    props.unread ? 'IBMPlexSans-SemiBold' : 'IBMPlexSans-Light'};
  font-size: 13px;
  line-height: 17px;
  color: ${(props) => props.theme.shade.foreground};
`

const Dot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.color.blueberry400};
  margin-left: 8px;
`

const Message = styled.Text`
  font-family: 'IBMPlexSans-Light';
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.shade.foreground};
  padding-bottom: 8px;
`;

const Actions = styled.View`
  flex-direction: row;
  padding-bottom: 8px;
`;

const Button = styled.TouchableHighlight`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 16px;
  background-color: ${props => props.theme.color.blue400};
  border-radius: 8px;
  margin-right: 16px;
`;

const ButtonText = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 13px;
  line-height: 17px;
  color: ${(props) => props.theme.shade.foreground};
`;

interface ListItemAction {
  id: string;
  text: string;
  onPress(props: ListItemAction): any;
}

interface ListItemProps {
  title: string;
  date: Date | string;
  subtitle: string;
  unread?: boolean;
  actions?: ListItemAction[];
  icon?: React.ReactNode;
}

export function ListItem({ title, subtitle, date, icon, actions, unread = false }: ListItemProps) {
  return (
    <Host>
      {icon ? <Icon>
        {icon}
      </Icon> : null}
      <Content>
        <Row>
          <Title>
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
        <Message>{subtitle}</Message>
        {actions?.length ? (
          <Actions>
          {actions.map(action => (
            <Button
              key={action.id}
              underlayColor={theme.color.blue600}
              onPress={() => action.onPress(action)}
            >
              <ButtonText>{action.text}</ButtonText>
            </Button>
          ))}
        </Actions>
        ) : null}
      </Content>
    </Host>
  )
}
