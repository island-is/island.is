import { ServicePortalPath } from '@island.is/service-portal/core'

export interface NotificationCard {
  id: string
  title: string
  text: string
  link: {
    title: string
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
          title: 'Tilkynning frá Stafrænt Ísland',
          text:
            'Hér kemur þú til með að fá skilaboð frá öllum helstu stofnunum Íslands.',
          link: {
            title: 'Halda áfram',
            url: ServicePortalPath.MessagesRoot,
          },
          isRead: true,
          provider: 'Island.is',
          type: 'Tilkynning',
        },
        {
          id: '222',
          title: 'Stafrænt vegabréf',
          text: 'Dæmi um skilaboð sem koma hér inn í framtíðinni',
          link: {
            title: 'Halda áfram',
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
