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
          id: 'asdf',
          title: 'Vegabréfið að renna út',
          text: 'Vegabréfið þitt rennur út 23.06.2020',
          link: {
            title: 'Endurnýja ökuskírteini',
            url: '/stillingar',
          },
          isRead: false,
        },
        {
          id: 'fdsafds',
          title: 'Skimun á krabbameini',
          text:
            'Þú hefur fengið boð um að mæta í hópleit að brjóstakrabbameini',
          link: {
            title: 'Finna tíma í skimun',
            url: '/umsoknir',
          },
          isRead: true,
        },
        {
          id: 'ffddsads',
          title: 'Skuldleysisvottorð',
          text: 'Þú hefur fengið sent skuldleysisvottorð einstaklings',
          link: {
            title: 'Sækja skuldleysisvottorð',
            url: '/rafraen-skjol',
          },
          isRead: true,
        },
        {
          id: 'aaasdfdfd',
          title: 'Lyfseðill',
          text: 'Þú hefur fengið sendan lyfseðil í lyfseðilsgáttina',
          link: {
            title: 'Skoða lyfseðil',
            url: '/umsoknir/opnar-umsoknir',
          },
          isRead: true,
        },
      ],
    },
  ],
}
