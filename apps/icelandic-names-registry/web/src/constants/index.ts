const Paths = {
  MinarSidurRoot: '/',
  MinarSidurSignInOidc: '/signin-oidc',
  MinarSidurSilentSignInOidc: '/silent/signin-oidc',
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

export default Paths
