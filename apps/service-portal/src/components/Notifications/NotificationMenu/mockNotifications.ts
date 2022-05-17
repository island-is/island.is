import { ServicePortalPath } from '@island.is/service-portal/core'
import { defineMessage, MessageDescriptor } from 'react-intl'
import { m } from '@island.is/service-portal/core'

export interface NotificationCard {
  id: string
  title: MessageDescriptor
  text: MessageDescriptor
  link: {
    title: MessageDescriptor
    url: string
  }
  isRead: boolean
  wip?: boolean
  provider: string
  type: 'Tilkynning'
}

export interface NotificationsContainer {
  sections: {
    timestamp: Date
    cards: NotificationCard[]
  }[]
}

export const notifications: NotificationsContainer = {
  sections: [
    {
      timestamp: new Date(),
      cards: [
        {
          id: '111',
          title: defineMessage({
            id: 'sp.messages:mock-1-title',
            defaultMessage: 'Tilkynning frá Stafrænt Ísland',
          }),
          text: defineMessage({
            id: 'sp.messages:mock-1-text',
            defaultMessage:
              'Hér birtast skilaboð sem þú færð send frá helstu stofnunum hins opinbera.',
          }),
          link: {
            title: m.continue,
            url: ServicePortalPath.MessagesRoot,
          },
          isRead: true,
          provider: 'Island.is',
          type: 'Tilkynning',
        },
        {
          id: '222',
          title: defineMessage({
            id: 'sp.messages:mock-2-title',
            defaultMessage: 'Stafrænt vegabréf',
          }),
          text: defineMessage({
            id: 'sp.messages:mock-2-text',
            defaultMessage: 'Dæmi um skilaboð sem koma hér inn í framtíðinni',
          }),
          link: {
            title: m.continue,
            url: ServicePortalPath.MessagesRoot,
          },
          isRead: true,
          wip: true,
          provider: 'Sýslumaður',
          type: 'Tilkynning',
        },
      ],
    },
  ],
}
