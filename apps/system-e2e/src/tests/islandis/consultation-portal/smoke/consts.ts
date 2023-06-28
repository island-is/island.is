import {
  heroBanner,
  filter,
  searchAndFilter,
} from '../../../../../../consultation-portal/screens/Home/Home.json'
import {
  footer,
  menu,
} from '../../../../../../consultation-portal/components/Layout/Layout.json'
import { menuItems } from '../../../../../../consultation-portal/components/Layout/components/Menu/components'

export const URL = '/samradsgatt'
export const URL_LOCALE = '/samradsgatt?locale=is&hide_onboarding_modal=true'

const NAV_LINKS = [
  'menuItem_allCases',
  'menuItem_subscriptions',
  'menuItem_advices',
]

export const MENU_LOGIN = 'menuItem_login'
export const MENU_USERMENU = 'menuItem_userMenu'

export const NOT_LOGGED_IN_NAV = [...NAV_LINKS, ...MENU_LOGIN]
export const LOGGED_IN_NAV = [...NAV_LINKS, ...MENU_USERMENU]

// export const HERO = {
//   text: heroBanner.introText,
//   links: [
//     {
//       label: heroBanner.arrowLink.internalLink.text,
//       href: heroBanner.arrowLink.internalLink.href,
//     },
//     {
//       label: heroBanner.arrowLink.externalLink.text,
//       href: heroBanner.arrowLink.externalLink.href,
//     },
//   ],
// }

// export const FILTERS = [
//   'Leit',
//   searchAndFilter.policyAreaSelect.placeholder,
//   searchAndFilter.institutionSelect.placeholder,
//   filter.filter.sortBoxTitle,
//   filter.filter.statusBoxTitle,
//   filter.filter.typeBoxTitle,
// ]

// export const FOOTER = {
//   text: footer.text,
//   link: {
//     label: footer.arrowLinkText,
//     href: 'samradsgatt@stjornarradid.is',
//   },
// }

// interface TextHref {
//   text: string
//   href?: string
// }

// interface Button {
//   label: string
//   href?: string
// }

// interface CTA {
//   title: string
//   text: string
//   button: Button
//   mySubsButton?: Button
// }

// export interface PagesInterface {
//   [key: string]: Pages
// }

// interface Pages {
//   label: string
//   href: string
//   breadcrumbs: Array<TextHref>
//   title: string
//   text: string
//   CTA?: CTA
//   unsubscribe?: TextHref
//   tabs?: Array<{ text: string }>
// }

// const COMMON_STATES = {
//   subscriptions: {
//     label: 'Áskriftir',
//     href: '/askriftir',
//     breadcrumbs: [
//       {
//         text: 'Samráðsgátt',
//         href: '/',
//       },
//       {
//         text: 'Áskriftir',
//         href: '/askriftir',
//       },
//     ],
//     title: 'Áskriftir',
//     text:
//       'Hér er hægt að skrá sig í áskrift að málum. Þú skráir þig inn, hakar við einn eða fleiri flokka (mál/stofnanir/málefnasvið), í stofnunum og málefnasviðum þá getur þú valið um hvort þú vilt tilkynningar um ný mál eða tilkynningar um ný mál og breytingar, og smellir á „Skrá í áskrift“. Loks þarftu að staðfesta áskriftina í gegnum netfangið sem þú skráðir. Kerfið er uppfært einu sinni á sólarhring.',
//   },
//   advices: {
//     label: 'Mínar umsagnir',
//     href: '/umsagnir',
//     breadcrumbs: [
//       {
//         text: 'Samráðsgátt',
//         href: '/',
//       },
//       {
//         text: 'Mínar umsagnir',
//       },
//     ],
//     title: 'Mínar umsagnir',
//     text: 'Hér geturðu skoðað allar umsagnir sem þú hefur sent inn.',
//   },
// }

// export const LOGGED_IN_STATES = {
//   subscriptions: {
//     ...COMMON_STATES.subscriptions,
//     CTA: {
//       title: '',
//       text: 'Núverandi skráð netfang:',
//       button: {
//         label: 'Breyta netfangi',
//       },
//       mySubsButton: {
//         label: 'Sjá áskriftir',
//         href: '/minaraskriftir',
//       },
//     },
//     unsubscribe: {
//       text: 'Hægt er að afskrá sig hér',
//       href: '/minaraskriftir',
//     },
//   },
//   advices: {
//     ...COMMON_STATES.advices,
//   },
//   mySubscriptions: {
//     label: 'Sjá áskriftir',
//     href: '/minaraskriftir',
//     breadcrumbs: [
//       {
//         text: 'Samráðsgátt',
//         href: '/',
//       },
//       {
//         text: 'Áskriftir',
//         href: '/askriftir',
//       },
//       {
//         text: 'Mínar áskriftir',
//         href: '/minaraskriftir',
//       },
//     ],
//     title: 'Mínar áskriftir',
//     text:
//       'Hér er hægt að halda utan um áskriftir og skrá sig úr áskriftum. Aðeins birtast virk mál. Kerfið er uppfært einu sinni á sólarhring.',
//     tabs: [
//       {
//         text: 'Mál',
//       },
//       { text: 'Stofnanir' },
//       { text: 'Málefnasvið' },
//     ],
//   },
// } as PagesInterface

// export const LOGGED_OUT_STATES = {
//   subscriptions: {
//     ...COMMON_STATES.subscriptions,
//     CTA: {
//       title: 'Skrá áskrift',
//       text:
//         'Þú verður að vera skráð(ur) inn á island.is til þess að geta skráð þig í eða úr áskrift.',
//       button: {
//         label: 'Skrá mig inn',
//       },
//     },
//   },

//   advices: {
//     ...COMMON_STATES.advices,
//     CTA: {
//       title: 'Mínar umsagnir',
//       text:
//         'Þú verður að vera skráð(ur) inn til þess að geta séð þínar umsagnir.',
//       button: {
//         label: 'Skrá mig inn',
//       },
//     },
//   },
// } as PagesInterface

// export const LOGIN_BUTTONS = {
//   indexPage: {
//     location: '/',
//     label: 'Innskráning',
//   },
//   subscriptions: {
//     location: '/askriftir',
//     label: 'Skrá mig inn',
//   },
//   advices: {
//     location: '/umsagnir',
//     label: 'Skrá mig inn',
//   },
// }

// export const LOGIN = {
//   buttons: {
//     loggedOut: 'Innskráning',
//     loggedIn: 'Gervimaður Afríka',
//   },
//   locators: {
//     phoneUserIdentifier: '#phoneUserIdentifier',
//     submitPhoneUser: '#submitPhoneNumber',
//   },
//   phoneNumber: '0103019',
// }
