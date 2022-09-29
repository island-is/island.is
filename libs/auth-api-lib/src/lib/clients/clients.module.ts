import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { ClientsService } from './clients.service'
import { ClientAllowedCorsOrigin } from './models/client-allowed-cors-origin.model'
import { ClientClaim } from './models/client-claim.model'
import { ClientGrantType } from './models/client-grant-type.model'
import { ClientRedirectUri } from './models/client-redirect-uri.model'
import { ClientPostLogoutRedirectUri } from './models/client-post-logout-redirect-uri.model'
import { Client } from './models/client.model'
import { ClientAllowedScope } from './models/client-allowed-scope.model'
import { ClientIdpRestrictions } from './models/client-idp-restrictions.model'
import { ClientSecret } from './models/client-secret.model'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Client,
      ClientAllowedCorsOrigin,
      ClientAllowedScope,
      ClientClaim,
      ClientGrantType,
      ClientIdpRestrictions,
      ClientPostLogoutRedirectUri,
      ClientRedirectUri,
      ClientSecret,
    ]),
  ],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
