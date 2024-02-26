import { ConfigType } from '@nestjs/config'
import { Provider } from '@nestjs/common'
import { CONFIG_PROVIDER, PassTemplateIds } from '../licenseClient.type'
import { AdrDigitalLicenseClientConfig } from '../clients/adr-license-client'

export const PassTemplateIdsProvider: Provider = {
  provide: CONFIG_PROVIDER,
  useFactory: (adrConfig: ConfigType<typeof AdrDigitalLicenseClientConfig>) => {
    const ids: PassTemplateIds = {
      adrLicense: adrConfig.passTemplateId,
    }
    return ids
  },
  inject: [AdrDigitalLicenseClientConfig.KEY],
}
