import {NavigationBarSheet, NotificationCard} from '@ui';
import {dismissAllNotificationsAsync} from 'expo-notifications';
import React, {useCallback, useEffect} from 'react';
import {useIntl} from 'react-intl';
import {FlatList, SafeAreaView, TouchableHighlight} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {useTheme} from 'styled-components';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';
import {navigateToNotification} from '../../lib/deep-linking';
import {
  actionsForNotification,
  Notification,
  useNotificationsStore,
} from '../../stores/notifications-store';
import {useOrganizationsStore} from '../../stores/organizations-store';
import {testIDs} from '../../utils/test-ids';

const {getNavigationOptions, useNavigationOptions} =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: false,
    },
  }));

export const NotificationsScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId);
  const {getNotifications} = useNotificationsStore();
  const intl = useIntl();
  const theme = useTheme();
  const notifications = getNotifications();
  const {getOrganizationLogoUrl} = useOrganizationsStore();

  const onNotificationPress = useCallback((notification: Notification) => {
    navigateToNotification(notification, componentId);
  }, []);

  useEffect(() => {
    dismissAllNotificationsAsync();
  });

  const renderNotificationItem = ({item}: {item: Notification}) => {
    return (
      <TouchableHighlight
        underlayColor={
          theme.isDark ? theme.shades.dark.shade100 : theme.color.blue100
        }
        onPress={() => onNotificationPress(item)}
        testID={testIDs.NOTIFICATION_CARD_BUTTON}>
        <NotificationCard
          key={item.id}
          id={item.id}
          category={item.category}
          title={item.title!}
          message={item.body!}
          date={new Date(item.date)}
          icon={getOrganizationLogoUrl(item.title!, 64)}
          unread={!item.read}
          onPress={() => onNotificationPress(item)}
          actions={actionsForNotification(item, componentId)}
        />
      </TouchableHighlight>
    );
  };

  return (
    <>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({id: 'notifications.screenTitle'})}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{marginHorizontal: 16}}
      />
      <SafeAreaView
        style={{marginHorizontal: 16, flex: 1}}
        testID={testIDs.SCREEN_NOTIFICATIONS}>
        <FlatList
          style={{flex: 1, paddingTop: 16}}
          data={notifications}
          keyExtractor={(item: Notification) => item.id}
          renderItem={renderNotificationItem}
        />
      </SafeAreaView>
    </>
  );
};

NotificationsScreen.options = getNavigationOptions;
