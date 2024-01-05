import { Module } from '@nestjs/common'

import { AuthModule } from '@island.is/auth-nest-tools'
import { DocumentsClientModule } from '@island.is/clients/documents'
import {
  FinanceClientConfig,
  FinanceClientModule,
} from '@island.is/clients/finance'
import { AuditModule } from '@island.is/nest/audit'
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'

import { DocumentController } from './modules/documents/document.controller'
import { DocumentsInfraController } from './modules/infra/documentsInfra.controller'
import { FinanceDocumentController } from './modules/finance-documents/document.controller'
import { environment } from '../environments'
import { VehicleController } from './modules/vehicles-documents/vehicle-document.controller'
import { EducationController } from './modules/education-documents/education-document.controller'
import { RegulationDocumentsController } from './modules/regulation-documents/regulation-documents.controller'
import { WorkMachinesController } from './modules/work-machines-documents/work-machines-documents.controller'
import { OccupationalLicensesEducationController } from './modules/occupational-licenses/education-license.controller'
import { MMSClientModule, MMSClientConfig } from '@island.is/clients/mms'
import {
  VehiclesClientConfig,
  VehiclesClientModule,
} from '@island.is/clients/vehicles'
import {
  UniversityOfIcelandClientConfig,
  UniversityOfIcelandClientModule,
} from '@island.is/clients/university-of-iceland'
import {
  RegulationsClientConfig,
  RegulationsClientModule,
} from '@island.is/clients/regulations'
import {
  RegulationsAdminClientConfig,
  RegulationsAdminClientModule,
} from '@island.is/clients/regulations-admin'
import {
  WorkMachinesClientConfig,
  WorkMachinesClientModule,
} from '@island.is/clients/work-machines'
import { HealthPaymentsOverviewController } from './modules/health/payment-overview-documents.controller'
import {
  RightsPortalClientConfig,
  RightsPortalClientModule,
} from '@island.is/clients/icelandic-health-insurance/rights-portal'
@Module({
  controllers: [
    DocumentController,
    DocumentsInfraController,
    FinanceDocumentController,
    VehicleController,
    EducationController,
    RegulationDocumentsController,
    WorkMachinesController,
    OccupationalLicensesEducationController,
    HealthPaymentsOverviewController,
  ],
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    DocumentsClientModule.register({
      basePath: environment.documentService.basePath,
      clientId: environment.documentService.clientId,
      clientSecret: environment.documentService.clientSecret,
      tokenUrl: environment.documentService.tokenUrl,
    }),
    FinanceClientModule,
    VehiclesClientModule,
    UniversityOfIcelandClientModule,
    RegulationsAdminClientModule,
    RegulationsClientModule,
    WorkMachinesClientModule,
    MMSClientModule,
    RightsPortalClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        FinanceClientConfig,
        IdsClientConfig,
        XRoadConfig,
        VehiclesClientConfig,
        UniversityOfIcelandClientConfig,
        RegulationsAdminClientConfig,
        RegulationsClientConfig,
        WorkMachinesClientConfig,
        MMSClientConfig,
        RightsPortalClientConfig,
      ],
    }),
  ],
})
export class AppModule {}
