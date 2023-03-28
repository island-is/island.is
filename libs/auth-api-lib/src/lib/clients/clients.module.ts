import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { TranslationModule } from '../translation/translation.module'
import { ClientsService } from './clients.service'
import { AdminClientsService } from './admin/admin-clients.service'
import { ClientAllowedCorsOrigin } from './models/client-allowed-cors-origin.model'
import { ClientClaim } from './models/client-claim.model'
import { ClientGrantType } from './models/client-grant-type.model'
import { ClientRedirectUri } from './models/client-redirect-uri.model'
import { ClientPostLogoutRedirectUri } from './models/client-post-logout-redirect-uri.model'
import { Client } from './models/client.model'
import { ClientAllowedScope } from './models/client-allowed-scope.model'
import { ClientIdpRestrictions } from './models/client-idp-restrictions.model'
import { ClientSecret } from './models/client-secret.model'
import { ClientsTranslationService } from './clients-translation.service'
import { Domain } from '../resources/models/domain.model'

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
      Domain,
    ]),
    TranslationModule,
  ],
  providers: [ClientsService, AdminClientsService, ClientsTranslationService],
  exports: [ClientsService, AdminClientsService],
})
export class ClientsModule {}
