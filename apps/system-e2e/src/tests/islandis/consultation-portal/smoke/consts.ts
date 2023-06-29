import {
  heroBanner,
  filter,
} from '../../../../../../consultation-portal/screens/Home/Home.json'
import { footer } from '../../../../../../consultation-portal/components/Layout/Layout.json'
import {
  emailBox,
  subscriptionSkeleton,
} from '../../../../../../consultation-portal/screens/Subscriptions/Subscriptions.json'
import { advices } from '../../../../../../consultation-portal/screens/Advices/Advices.json'

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
  links: [
    {
      label: heroBanner.arrowLink.internalLink.text,
    },
    {
      label: heroBanner.arrowLink.externalLink.text,
    },
  ],
  aboutLink: {
    label: heroBanner.arrowLink.internalLink.text,
    href: heroBanner.arrowLink.internalLink.href,
  },
}

export const FILTERS = [
  filter.filter.sortBoxTitle,
  filter.filter.statusBoxTitle,
  filter.filter.typeBoxTitle,
]

export const FOOTER = {
  text: footer.text,
  linkLabel: footer.arrowLinkText,
}

export const STATES = {
  subscriptions: {
    CTA: {
      title: emailBox.loginActionCard.heading,
      text: emailBox.loginActionCard.text,
      button: {
        label: emailBox.loginActionCard.buttonLabel,
      },
    },
    unsubscribeLink: {
      text: subscriptionSkeleton.unsubscribeLink.text,
      href: subscriptionSkeleton.unsubscribeLink.href,
    },
  },
  advices: {
    CTA: {
      title: advices.subscriptionActionCard.heading,
      text: advices.subscriptionActionCard.text,
      button: {
        label: advices.subscriptionActionCard.buttonLabel,
      },
    },
    intro: {
      title: advices.intro.title,
      text: advices.intro.text,
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
