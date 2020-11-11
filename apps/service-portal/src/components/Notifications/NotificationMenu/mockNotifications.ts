import { ServicePortalPath } from '@island.is/service-portal/core'
import { defineMessage, MessageDescriptor } from 'react-intl'

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

const continueMessage = defineMessage({
  id: 'service.portal:continue',
  defaultMessage: 'Halda áfram',
})

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
              'Hér kemur þú til með að fá skilaboð frá öllum helstu stofnunum Íslands.',
          }),
          link: {
            title: continueMessage,
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
            title: continueMessage,
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
