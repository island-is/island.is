import { ConfigType } from '@nestjs/config'
import { Provider } from '@nestjs/common'
import { CONFIG_PROVIDER, PassTemplateIds } from '../licenseClient.type'
import { AdrDigitalLicenseClientConfig } from '../clients/adr-license-client'
import { DisabilityDigitalLicenseClientConfig } from '../clients/disability-license-client'
import { FirearmDigitalLicenseClientConfig } from '../clients/firearm-license-client'
import { MachineDigitalLicenseClientConfig } from '../clients/machine-license-client'
import { DrivingDigitalLicenseClientConfig } from '../clients/driving-license-client'

export const PassTemplateIdsProvider: Provider = {
  provide: CONFIG_PROVIDER,
  useFactory: (
    firearmConfig: ConfigType<typeof FirearmDigitalLicenseClientConfig>,
    adrConfig: ConfigType<typeof AdrDigitalLicenseClientConfig>,
    machineConfig: ConfigType<typeof MachineDigitalLicenseClientConfig>,
    disabilityConfig: ConfigType<typeof DisabilityDigitalLicenseClientConfig>,
    drivingConfig: ConfigType<typeof DrivingDigitalLicenseClientConfig>,
  ) => {
    const ids: PassTemplateIds = {
      firearmLicense: firearmConfig.passTemplateId,
      adrLicense: adrConfig.passTemplateId,
      machineLicense: machineConfig.passTemplateId,
      disabilityLicense: disabilityConfig.passTemplateId,
      driversLicense: drivingConfig.passTemplateId,
    }
    return ids
  },
  inject: [
    FirearmDigitalLicenseClientConfig.KEY,
    AdrDigitalLicenseClientConfig.KEY,
    MachineDigitalLicenseClientConfig.KEY,
    DisabilityDigitalLicenseClientConfig.KEY,
    DrivingDigitalLicenseClientConfig.KEY,
  ],
}
