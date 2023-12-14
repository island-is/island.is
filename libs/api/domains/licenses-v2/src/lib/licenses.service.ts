import { LicenseClientService } from '@island.is/clients/license-client'
import { CmsContentfulService } from '@island.is/cms'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class LicensesService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly licenseClient: LicenseClientService,
    private readonly cmsContentfulService: CmsContentfulService,
  ) {}

  async get
}
