import Providers from 'next-auth/providers'
import { identityServerConfig } from '@island.is/air-discount-scheme-web/lib'

const idsProvider = Providers.IdentityServer4({
  id: identityServerConfig.id,
  name: identityServerConfig.name,
  scope: identityServerConfig.scope,
  clientId: identityServerConfig.clientId,
  domain: 'identity-server.dev01.devland.is',
  clientSecret: process.env.IDENTITY_SERVER_SECRET,
  authorizationUrl: process.env.NEXTAUTH_URL,
  protection: 'pkce',
})

export default idsProvider