import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { DocumentsInfraController } from './controllers/documentsInfra.controller'
import { OrganisationController } from './controllers/organisation.controller'
import { ProviderController } from './controllers/provider.controller'
import { DocumentProviderService } from './document-provider.service'
import { AdministrativeContact } from './models/administrativeContact.model'
import { Helpdesk } from './models/helpdesk.model'
import { Organisation } from './models/organisation.model'
import { Provider } from './models/provider.model'
import { TechnicalContact } from './models/technicalContact.model'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { Changelog } from './models/changelog.model'
import { ChangelogController } from './controllers/changelog.controller'

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
