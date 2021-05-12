import React from 'react';
import { theme } from '@island.is/island-ui/theme';
import styled from 'styled-components/native';
import { NavigationFunctionComponent } from 'react-native-navigation';
import { ButtonRegistry } from '../../utils/navigation-registry';
import { TouchableOpacity } from 'react-native';

const Host = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: ${theme.color.blue100};
  align-items: center;
  justify-content: center;
`;

const Logo = styled.Image`
  width: 16px;
  height: 16px;
`;

const Dot = styled.View`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${theme.color.red400};
`;

export const NavigationBarButton: NavigationFunctionComponent = ({ componentId }) => {
  const isNotifications = componentId === ButtonRegistry.NotificationsButton;
  return (
    <>
      <TouchableOpacity>
        <Host>
          {isNotifications && <Dot />}
          <Logo source={isNotifications ? require('../../assets/icons/navbar-notifications.png') : require('../../assets/icons/navbar-user.png')} />
        </Host>
      </TouchableOpacity>
    </>
  );
}
