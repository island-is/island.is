import { Content, dynamicColor, Header, NavigationBarSheet } from '@ui'
import React from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import styled from 'styled-components/native'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import {
  actionsForNotification,
  useNotificationsStore,
} from '../../stores/notifications-store'
import { useOrganizationsStore } from '../../stores/organizations-store'
import { testIDs } from '../../utils/test-ids'

interface NotificationDetailScreenProps {
  id: string
}

const Host = styled.SafeAreaView`
  margin-left: 24px;
  margin-right: 24px;
  flex: 1;
`

const Actions = styled.View`
  flex-direction: row;
  justify-content: center;

  padding-top: 8px;

  border-top-width: 1px;
  border-top-color: ${dynamicColor(
    (props) => ({
      dark: props.theme.shades.dark.shade200,
      light: props.theme.color.blue100,
    }),
    true,
  )};
`

const Action = styled.Button`
  flex: 1;
`

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: false,
    },
  }))

export const NotificationDetailScreen: NavigationFunctionComponent<
  NotificationDetailScreenProps
> = ({ componentId, id }) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const { items } = useNotificationsStore()
  const { getOrganizationLogoUrl } = useOrganizationsStore()
  const notification = items.get(id)!
  const actions = actionsForNotification(notification, componentId)

  return (
    <Host testID={testIDs.SCREEN_NOTIFICATION_DETAIL}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({ id: 'notificationDetail.screenTitle' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
      />
      <Header
        title={notification.title}
        logo={getOrganizationLogoUrl(notification.title, 64)}
        date={<FormattedDate value={new Date(notification.date)} />}
      />
      <Content title={notification.body} message={notification.copy} />
      {actions.length > 0 && (
        <Actions>
          {actions.map((action, i) => (
            <Action key={i} onPress={action.onPress} title={action.text} />
          ))}
        </Actions>
      )}
    </Host>
  )
}

NotificationDetailScreen.options = getNavigationOptions
