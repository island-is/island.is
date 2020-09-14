import { Module } from '@nestjs/common'
import { ClientsService } from './clients.service'
import { ClientsController } from './clients.controller'
import { Client } from './models/client.model'
import { SequelizeModule } from '@nestjs/sequelize'
<<<<<<< HEAD
import { ClientAllowedScope } from './client-allowed-scope.model'
import { ClientAllowedCorsOrigin } from './client-allowed-cors-origin.model'
import { ClientPostLogoutRedirectUri } from './client-post-logout-redirect-uri.model'
import { ClientRedirectUri } from './client-redirect-uri.model'
import { ClientIdpRestrictions } from './client-idp-restrictions.model'
import { ClientSecret } from './client-secret.model'
import { ClientGrantType } from './client-grant-type.model'

@Module({
  imports: [SequelizeModule.forFeature([Client, ClientAllowedScope, ClientAllowedCorsOrigin, ClientPostLogoutRedirectUri, ClientRedirectUri, ClientIdpRestrictions, ClientSecret, ClientPostLogoutRedirectUri, ClientGrantType])],
=======
import { ClientAllowedScope } from './models/client-allowed-scope.model'
import { ClientAllowedCorsOrigin } from './models/client-allowed-cors-origin.model'
import { ClientPostLogoutRedirectUri } from './models/client-post-logout-redirect-uri.model'
import { ClientRedirectUri } from './models/client-redirect-uri.model'
import { ClientIdpRestrictions } from './models/client-idp-restrictions.model'
import { ClientSecret } from './models/client-secret.model'
import { ClientGrantType } from './models/client-grant-type.model'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Client,
      ClientAllowedScope,
      ClientAllowedCorsOrigin,
      ClientPostLogoutRedirectUri,
      ClientRedirectUri,
      ClientIdpRestrictions,
      ClientSecret,
      ClientPostLogoutRedirectUri,
      ClientGrantType,
    ]),
  ],
>>>>>>> f7e1e8d6357d8c2706c9ee3ce6d190beeb4520fe
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
