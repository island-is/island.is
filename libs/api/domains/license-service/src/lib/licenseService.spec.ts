import { LicenseServiceService } from './licenseService.service'
import { Test } from '@nestjs/testing'
import { MainResolver } from './graphql/main.resolver'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { GENERIC_LICENSE_FACTORY } from './licenceService.type'
import { AdrApi, AoshClientModule } from '@island.is/clients/aosh'

/*describe('LicenseService', () => {
  let licenseService: LicenseServiceService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AoshClientModule],
      providers: [AdrApi],
    }).compile()

    licenseService = moduleRef.get<LicenseServiceService>(LicenseServiceService)
  })

  describe('getAllLicenses', () => {
    it('should return all adr licenses', async () => {
      const result = ['test']
      jest
        .spyOn(licenseService, 'getAllLicenses')
        .mockImplementation(() => result)
    })
  })
})*/
