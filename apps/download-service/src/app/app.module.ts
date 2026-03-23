import { Module } from '@nestjs/common'

import { AuthModule } from '@island.is/auth-nest-tools'
import {
  DocumentsClientModule,
  DocumentClientConfig,
} from '@island.is/clients/documents'
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
import {
  FeatureFlagConfig,
  FeatureFlagModule,
} from '@island.is/nest/feature-flags'

import { DocumentController } from './modules/documents/document.controller'
import { DocumentsInfraController } from './modules/infra/documentsInfra.controller'
import { FinanceDocumentController } from './modules/finance-documents/document.controller'
import { environment } from '../environments'
import { VehicleController } from './modules/vehicles-documents/vehicle-document.controller'
import { EducationController } from './modules/education-documents/education-document.controller'
import { RegulationDocumentsController } from './modules/regulation-documents/regulation-documents.controller'
import { WorkMachinesController } from './modules/work-machines-documents/work-machines-documents.controller'
import { HealthPaymentsOverviewController } from './modules/health/payment-overview-documents.controller'
import { OccupationalLicensesController } from './modules/occupational-licenses/occupational-license.controller'
import { MMSClientModule, MMSClientConfig } from '@island.is/clients/mms'
import {
  VehiclesClientConfig,
  VehiclesClientModule,
} from '@island.is/clients/vehicles'
import {
  AgriculturalUniversityOfIcelandCareerClientConfig,
  BifrostUniversityCareerClientConfig,
  HolarUniversityCareerClientConfig,
  UniversityCareersClientModule,
  UniversityOfAkureyriCareerClientConfig,
  UniversityOfIcelandCareerClientConfig,
  IcelandUniversityOfTheArtsCareerClientConfig,
} from '@island.is/clients/university-careers'
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
import {
  RightsPortalClientConfig,
  RightsPortalClientModule,
} from '@island.is/clients/icelandic-health-insurance/rights-portal'
import {
  DistrictCommissionersLicensesClientConfig,
  DistrictCommissionersLicensesClientModule,
} from '@island.is/clients/district-commissioners-licenses'
import {
  HmsRentalAgreementClientConfig,
  HmsRentalAgreementClientModule,
} from '@island.is/clients/hms-rental-agreement'
import { RentalAgreementsController } from './modules/rental-agreements/rental-agreements.controller'
@Module({
  controllers: [
    DocumentController,
    DocumentsInfraController,
    FinanceDocumentController,
    VehicleController,
    EducationController,
    HealthPaymentsOverviewController,
    RegulationDocumentsController,
    WorkMachinesController,
    OccupationalLicensesController,
    RentalAgreementsController,
  ],
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    DocumentsClientModule,
    FinanceClientModule,
    VehiclesClientModule,
    RegulationsAdminClientModule,
    RegulationsClientModule,
    WorkMachinesClientModule,
    DistrictCommissionersLicensesClientModule,
    UniversityCareersClientModule,
    MMSClientModule,
    RightsPortalClientModule,
    FeatureFlagModule,
    HmsRentalAgreementClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        FinanceClientConfig,
        IdsClientConfig,
        XRoadConfig,
        VehiclesClientConfig,
        UniversityOfIcelandCareerClientConfig,
        AgriculturalUniversityOfIcelandCareerClientConfig,
        UniversityOfAkureyriCareerClientConfig,
        HolarUniversityCareerClientConfig,
        BifrostUniversityCareerClientConfig,
        IcelandUniversityOfTheArtsCareerClientConfig,
        RegulationsAdminClientConfig,
        RegulationsClientConfig,
        WorkMachinesClientConfig,
        MMSClientConfig,
        DistrictCommissionersLicensesClientConfig,
        RightsPortalClientConfig,
        DocumentClientConfig,
        FeatureFlagConfig,
        HmsRentalAgreementClientConfig,
      ],
    }),
  ],
})
export class AppModule {}
