import { ConfigType } from '@island.is/nest/config'
import { FactoryProvider } from '@nestjs/common'
import { LicenseServiceConfig } from '../licenseService.config'
import { TOKEN_SERVICE_PROVIDER } from '../licenseService.constants'
import { TokenService } from '../services/token.service'

export const TokenServiceProvider: FactoryProvider = {
  provide: TOKEN_SERVICE_PROVIDER,
  useFactory: (licenseServiceConfig: ConfigType<typeof LicenseServiceConfig>) =>
    new TokenService(licenseServiceConfig.barcodeSecretKey),
  inject: [LicenseServiceConfig.KEY],
}
