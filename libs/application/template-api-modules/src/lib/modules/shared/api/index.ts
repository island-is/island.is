import { IdentityModule } from './identity/identity.module'
import { IdentityService } from './identity/identity.service'
import { NationalRegistryModule } from './national-registry/national-registry.module'
import { NationalRegistryService } from './national-registry/national-registry.service'
import { PaymentCatalogModule } from './payment-catalog/payment-catalog.module'
import { PaymentCatalogService } from './payment-catalog/payment-catalog.service'
import { UserProfileModule } from './user-profile/user-profile.module'
import { UserProfileService } from './user-profile/user-profile.service'
import { DrivingLicenseModule } from './driving-license/driving-license.module'
import { DrivingLicenseProviderService } from './driving-license/driving-license.service'
import { ApplicationModule } from './application/application.module'
import { ApplicationService } from './application/application.service'
import { SyslumennModule } from './syslumenn/syslumenn.module'
import { SyslumennService } from './syslumenn/syslumenn.service'

export const modules = [
  NationalRegistryModule,
  PaymentCatalogModule,
  UserProfileModule,
  IdentityModule,
  DrivingLicenseModule,
  ApplicationModule,
  SyslumennModule,
]

export const services = [
  NationalRegistryService,
  PaymentCatalogService,
  UserProfileService,
  IdentityService,
  DrivingLicenseProviderService,
  ApplicationService,
  SyslumennService,
]
