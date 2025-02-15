import { ConfigType } from '@nestjs/config'
import { AdrDigitalLicenseClientConfig } from '../clients/adr-license-client'
import { DisabilityDigitalLicenseClientConfig } from '../clients/disability-license-client'
import { DrivingDigitalLicenseClientConfig } from '../clients/driving-license-client'
import { FirearmDigitalLicenseClientConfig } from '../clients/firearm-license-client'
import { HuntingDigitalLicenseClientConfig } from '../clients/hunting-license-client'
import { MachineDigitalLicenseClientConfig } from '../clients/machine-license-client'

export type ClientConfigType =
  | ConfigType<typeof AdrDigitalLicenseClientConfig>
  | ConfigType<typeof DisabilityDigitalLicenseClientConfig>
  | ConfigType<typeof DrivingDigitalLicenseClientConfig>
  | ConfigType<typeof FirearmDigitalLicenseClientConfig>
  | ConfigType<typeof HuntingDigitalLicenseClientConfig>
  | ConfigType<typeof MachineDigitalLicenseClientConfig>
