import { IdentityModule } from './identity/identity.module'
import { IdentityService } from './identity/identity.service'
import { NationalRegistryModule } from './national-registry/national-registry.module'
import { NationalRegistryService } from './national-registry/national-registry.service'
import { PaymentApiModule } from './payment/payment.module'
import { PaymentService } from './payment/payment.service'
import { UserProfileModule } from './user-profile/user-profile.module'
import { UserProfileService } from './user-profile/user-profile.service'
import { DrivingLicenseModule } from './driving-license/driving-license.module'
import { DrivingLicenseProviderService } from './driving-license/driving-license.service'
import { ApplicationModule } from './application/application.module'
import { ApplicationService } from './application/application.service'
import { SyslumennModule } from './syslumenn/syslumenn.module'
import { SyslumennService } from './syslumenn/syslumenn.service'
import { VehiclesModule } from './vehicles/vehicles.module'
import { VehiclesService } from './vehicles/vehicles.service'
import { PassportModule } from './passport/passport.module'
import { PassportService } from './passport/passport.service'
import { DirectorateOfImmigrationModule } from './directorate-of-immigration/directorate-of-immigration.module'
import { DirectorateOfImmigrationService } from './directorate-of-immigration/directorate-of-immigration.service'
import { HealthInsuranceModule } from './health-insurance/health-insurance.module'
import { HealthInsuranceService } from './health-insurance/health-insurance.service'
import { InnaService } from './education/inna.service'
import { InnaModule } from './education/inna.module'
import { UserNotificationModule } from './user-notification/user-notification.module'
import { UserNotificationService } from './user-notification/user-notification.service'

export const dynamicModules = [UserProfileModule]

export const modules = [
  NationalRegistryModule,
  PaymentApiModule,
  IdentityModule,
  DrivingLicenseModule,
  ApplicationModule,
  SyslumennModule,
  VehiclesModule,
  PassportModule,
  DirectorateOfImmigrationModule,
  HealthInsuranceModule,
  InnaModule,
  UserNotificationModule,
]

export const services = [
  NationalRegistryService,
  PaymentService,
  UserProfileService,
  IdentityService,
  DrivingLicenseProviderService,
  ApplicationService,
  SyslumennService,
  VehiclesService,
  PassportService,
  DirectorateOfImmigrationService,
  HealthInsuranceService,
  InnaService,
  UserNotificationService,
]
