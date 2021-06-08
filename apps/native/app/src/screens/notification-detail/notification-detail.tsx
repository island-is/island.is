import {
  Content,
  Header,
  NavigationBarSheet,
} from '@island.is/island-ui-native'
import React from 'react'
import { FormattedDate } from 'react-intl'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import styled from 'styled-components/native'
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options'
import { useIntl } from '../../lib/intl'
import { useNotificationsStore } from '../../stores/notifications-store'
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

const {
  useNavigationOptions,
  getNavigationOptions,
} = useThemedNavigationOptions(() => ({
  topBar: {
    visible: false,
  },
}))

export const NotificationDetailScreen: NavigationFunctionComponent<NotificationDetailScreenProps> = ({
  componentId,
  id,
}) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const { items } = useNotificationsStore()
  const { getOrganizationLogoUrl } = useOrganizationsStore()
  const notification = items.get(id)!

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
    </Host>
  )
}

NotificationDetailScreen.options = getNavigationOptions
