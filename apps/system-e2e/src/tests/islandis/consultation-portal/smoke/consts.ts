const heroBanner = {
  arrowLink: {
    internalLink: {
      text: 'Lesa meira',
      href: '/um',
    },
  },
}

const filter = {
  sortBoxTitle: 'Röðun',
  statusBoxTitle: 'Staða máls',
  typeBoxTitle: 'Tegund máls',
}

const footer = {
  arrowLinkText: 'Senda ábendingu',
}

const loginActionCard = {
  heading: 'Skrá áskrift',
  buttonLabel: 'Skrá mig inn',
}

const unsubscribeLink = {
  text: ' Hægt er að afskrá sig hér',
  href: '/minaraskriftir',
}

const advices = {
  subscriptionActionCard: {
    heading: 'Mínar umsagnir',
    buttonLabel: 'Skrá mig inn',
  },
}

export const URL = '/samradsgatt'
export const URL_LOCALE = '/samradsgatt?locale=is&hide_onboarding_modal=true'
export const POST_LOGOUT_URL = 'https://island.is/'

const MENU_LOGIN_BTN = 'menu_loginBtn'
const LOGGED_IN_USERNAME = 'Gervimaður Afríka'
const NAV_LINKS = {
  allCases: 'menuItem_allCases',
  subscriptions: 'menuItem_subscriptions',
  advices: 'menuItem_advices',
}
export const NOT_LOGGED_IN_NAV = { ...NAV_LINKS, loginBtn: MENU_LOGIN_BTN }
export const LOGGED_IN_NAV = {
  ...NOT_LOGGED_IN_NAV,
  loggedInUser: LOGGED_IN_USERNAME,
}

export const HERO = {
  aboutLink: {
    label: heroBanner.arrowLink.internalLink.text,
    href: heroBanner.arrowLink.internalLink.href,
  },
}

export const FILTERS = [
  filter.sortBoxTitle,
  filter.statusBoxTitle,
  filter.typeBoxTitle,
]

export const FOOTER = {
  linkLabel: footer.arrowLinkText,
}

export const STATES = {
  subscriptions: {
    CTA: {
      title: loginActionCard.heading,
      button: {
        label: loginActionCard.buttonLabel,
      },
    },
    unsubscribeLink: {
      text: unsubscribeLink.text,
      href: unsubscribeLink.href,
    },
  },
  advices: {
    CTA: {
      title: advices.subscriptionActionCard.heading,
      button: {
        label: advices.subscriptionActionCard.buttonLabel,
      },
    },
  },
}

export const LOGIN = {
  locators: {
    phoneUserIdentifier: '#phoneUserIdentifier',
    submitPhoneUser: '#submitPhoneNumber',
  },
  phoneNumber: '0103019',
  logOutBtn: 'Útskrá',
}
