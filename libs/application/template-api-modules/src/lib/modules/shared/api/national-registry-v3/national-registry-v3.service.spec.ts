import { User } from '@island.is/auth-nest-tools'
import { NationalRegistryParameters } from '@island.is/application/types'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { NationalRegistryV3ApplicationsClientService } from '@island.is/clients/national-registry-v3-applications'

import { TemplateApiModuleActionProps } from '../../../../types'
import { NationalRegistryService } from '../national-registry/national-registry.service'
import { NationalRegistryV3Service } from './national-registry-v3.service'

const auth = { nationalId: '0101302479', authorization: 'Bearer x' } as User

const buildProps = (
  params?: NationalRegistryParameters,
): TemplateApiModuleActionProps<NationalRegistryParameters> =>
  ({ auth, params } as TemplateApiModuleActionProps<NationalRegistryParameters>)

describe('NationalRegistryV3Service', () => {
  let service: NationalRegistryV3Service
  let v2Service: jest.Mocked<NationalRegistryService>
  let v3Api: jest.Mocked<NationalRegistryV3ApplicationsClientService>
  let featureFlagService: jest.Mocked<FeatureFlagService>

  beforeEach(() => {
    v2Service = {
      nationalRegistry: jest.fn(),
      getIndividual: jest.fn(),
    } as unknown as jest.Mocked<NationalRegistryService>

    v3Api = {
      getIndividual: jest.fn().mockResolvedValue({
        nationalId: auth.nationalId,
        name: 'Name Nameson',
        givenName: 'Name',
        familyName: 'Nameson',
        birthdate: new Date('1990-01-01'),
        genderCode: '1',
        legalDomicile: { municipalityNumber: '0000' },
      }),
      getCitizenship: jest
        .fn()
        .mockResolvedValue({ countryCode: 'IS', countryName: 'Ísland' }),
      getCohabitationInfo: jest.fn().mockResolvedValue(null),
      getCustodyChildren: jest.fn().mockResolvedValue([]),
    } as unknown as jest.Mocked<NationalRegistryV3ApplicationsClientService>

    featureFlagService = {
      getValue: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<FeatureFlagService>

    service = new NationalRegistryV3Service(
      v2Service,
      v3Api,
      featureFlagService,
    )
  })

  // A ConfigCat outage makes getValue return whichever default we pass. It must
  // be `true`, otherwise an unreachable ConfigCat silently downgrades the
  // request to the deprecated v2 client.
  it('asks for the flag with v3 as the default', async () => {
    await service.nationalRegistry(buildProps({ icelandicCitizenship: true }))

    expect(featureFlagService.getValue).toHaveBeenNthCalledWith(
      1,
      Features.shouldApplicationSystemUseNationalRegistryV3,
      true,
      auth,
    )
    // every lookup this flow makes must default to v3, not just the first
    expect(featureFlagService.getValue.mock.calls.length).toBeGreaterThan(0)
    for (const [feature, defaultValue] of featureFlagService.getValue.mock
      .calls) {
      expect(feature).toBe(
        Features.shouldApplicationSystemUseNationalRegistryV3,
      )
      expect(defaultValue).toBe(true)
    }
  })

  it('asks for the flag with v3 as the default in getIndividual too', async () => {
    await service.getIndividual(auth.nationalId, auth)

    expect(featureFlagService.getValue).toHaveBeenCalledWith(
      Features.shouldApplicationSystemUseNationalRegistryV3,
      true,
      auth,
    )
  })

  // The flag stays usable as a rollback lever: switching it off in ConfigCat
  // must still route to v2 for as long as that service exists.
  it('still falls back to v2 when the flag is deliberately turned off', async () => {
    featureFlagService.getValue = jest.fn().mockResolvedValue(false)

    await service.nationalRegistry(buildProps({ icelandicCitizenship: true }))

    expect(v2Service.nationalRegistry).toHaveBeenCalledTimes(1)
    expect(v3Api.getIndividual).not.toHaveBeenCalled()
  })
})
