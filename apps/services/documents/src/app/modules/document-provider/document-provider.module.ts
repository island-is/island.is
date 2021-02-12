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

@Module({
  imports: [
    SequelizeModule.forFeature([
      Organisation,
      AdministrativeContact,
      Helpdesk,
      Provider,
      TechnicalContact,
    ]),
  ],
  controllers: [
    OrganisationController,
    ProviderController,
    DocumentsInfraController,
  ],
  providers: [DocumentProviderService, SequelizeConfigService],
})
export class DocumentProviderModule {}
