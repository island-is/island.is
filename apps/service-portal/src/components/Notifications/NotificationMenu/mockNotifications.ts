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
          title: 'Velkomin á Mínar Síður Ísland.is',
          text: 'Hér munu tilkynningar til þín frá ríkinu birtast',
          link: {
            title: 'Nánar',
            url: ServicePortalPath.SkilabodRoot,
          },
          isRead: false,
        },
      ],
    },
  ],
}
