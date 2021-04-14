import { Colors } from '@island.is/island-ui/theme'

export const Paths = {
  Root: '/',
  SignInOidc: '/signin-oidc',
  SilentSignInOidc: '/silent/signin-oidc',
}

export const NameTypeStrings = {
  ST: 'Stúlkunafn',
  DR: 'Drengjanafn',
  MI: 'Millinafn',
  RST: 'Ritbreytt stúlkunafn',
  RDR: 'Ritbreytt drengjanafn',
} as { [key: string]: string }

export const NameStatusStrings = {
  Haf: 'Hafnað',
  Sam: 'Samþykkt',
  Óaf: 'Óafgreitt',
} as { [key: string]: string }

export const NameStatusStringColors = {
  Haf: 'red600',
  Sam: 'blue400',
  Óaf: 'yellow600',
} as { [key: string]: Colors }

export const HEADER_HEIGHT_SM = 80
export const HEADER_HEIGHT_LG = 112

export const zIndex = {
  mobileMenu: 9,
  header: 10,
  notificationSidebar: 11,
  actionSidebar: 12,
  menu: 13,
  modal: 13,
}
