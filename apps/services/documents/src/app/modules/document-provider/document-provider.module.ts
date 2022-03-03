import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { SequelizeConfigService } from '../../sequelizeConfig.service'

import { ChangelogController } from './controllers/changelog.controller'
import { DocumentsInfraController } from './controllers/documentsInfra.controller'
import { OrganisationController } from './controllers/organisation.controller'
import { ProviderController } from './controllers/provider.controller'
import { AdministrativeContact } from './models/administrativeContact.model'
import { Changelog } from './models/changelog.model'
import { Helpdesk } from './models/helpdesk.model'
import { Organisation } from './models/organisation.model'
import { Provider } from './models/provider.model'
import { TechnicalContact } from './models/technicalContact.model'
import { DocumentProviderService } from './document-provider.service'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Organisation,
      AdministrativeContact,
      Helpdesk,
      Provider,
      TechnicalContact,
      Changelog,
    ]),
  ],
  controllers: [
    OrganisationController,
    ProviderController,
    DocumentsInfraController,
    ChangelogController,
  ],
  providers: [DocumentProviderService, SequelizeConfigService],
})
export class DocumentProviderModule {}
