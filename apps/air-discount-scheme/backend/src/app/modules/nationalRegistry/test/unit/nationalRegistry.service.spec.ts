import { Test } from '@nestjs/testing'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { NationalRegistryService } from '../../nationalRegistry.service'
import { NationalRegistryUser } from '../../nationalRegistry.types'

import { AirDiscountSchemeScope } from '@island.is/auth/scopes'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import {
  NationalRegistryClientConfig,
  NationalRegistryClientModule,
  NationalRegistryClientService,
} from '@island.is/clients/national-registry-v2'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { Features } from '@island.is/feature-flags'

const user: NationalRegistryUser = {
  nationalId: '1306886513',
  firstName: 'Jón',
  gender: 'kk',
  lastName: 'Jónsson',
  middleName: 'Gunnar',
  address: 'Bessastaðir 1',
  postalcode: 225,
  city: 'Álftanes',
}

const auth: AuthUser = {
  nationalId: '1326487905',
  scope: [AirDiscountSchemeScope.default],
  authorization: '',
  client: '',
}

describe('NationalRegistryService', () => {
  let nationalRegistryService: NationalRegistryService
  let v2Client: NationalRegistryClientService
  const v3Client = {
    getAllDataIndividual: jest.fn(),
    getCustodians: jest.fn(),
  }
  const featureFlagService = { getValue: jest.fn() }

  beforeEach(async () => {
    v3Client.getAllDataIndividual.mockReset()
    v3Client.getCustodians.mockReset()
    featureFlagService.getValue.mockReset()
    featureFlagService.getValue.mockResolvedValue(false)
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [XRoadConfig, NationalRegistryClientConfig],
        }),
        NationalRegistryClientModule,
      ],
      providers: [
        NationalRegistryService,
        {
          provide: NationalRegistryV3ClientService,
          useValue: v3Client,
        },
        {
          provide: FeatureFlagService,
          useValue: featureFlagService,
        },
        {
          provide: CACHE_MANAGER,
          useClass: jest.fn(() => ({
            get: () => ({}),
            set: () => ({}),
          })),
        },
        {
          provide: LOGGER_PROVIDER,
          useClass: jest.fn(() => ({
            error: () => ({}),
          })),
        },
      ],
    }).compile()

    nationalRegistryService = moduleRef.get<NationalRegistryService>(
      NationalRegistryService,
    )
    v2Client = moduleRef.get(NationalRegistryClientService)
  })

  describe('getRelations', () => {
    it('uses v2 when the flag is off', async () => {
      jest
        .spyOn(v2Client, 'getCustodyChildren')
        .mockResolvedValue(['0101011234'])

      await expect(nationalRegistryService.getRelations(auth)).resolves.toEqual(
        ['0101011234'],
      )
      expect(featureFlagService.getValue).toHaveBeenCalledWith(
        Features.shouldAirDiscountSchemeUseNationalRegistryV3,
        false,
        auth,
      )
      expect(v3Client.getAllDataIndividual).not.toHaveBeenCalled()
    })

    it('reads custody children from v3 when the flag is on', async () => {
      featureFlagService.getValue.mockResolvedValue(true)
      v3Client.getAllDataIndividual.mockResolvedValue({
        forsja: {
          born: [{ barnKennitala: '0101011234' }, { barnKennitala: null }],
        },
      })
      const v2Lookup = jest.spyOn(v2Client, 'getCustodyChildren')

      await expect(nationalRegistryService.getRelations(auth)).resolves.toEqual(
        ['0101011234'],
      )
      expect(v3Client.getAllDataIndividual).toHaveBeenCalledWith(
        auth.nationalId,
      )
      expect(v2Lookup).not.toHaveBeenCalled()
    })
  })

  it('reads custodians from v3 without adding the caller', async () => {
    featureFlagService.getValue.mockResolvedValue(true)
    v3Client.getCustodians.mockResolvedValue([
      { forsjaAdiliKennitala: '1306886513' },
      { forsjaAdiliKennitala: null },
    ])
    v3Client.getAllDataIndividual.mockResolvedValue({
      kennitala: '1306886513',
      nafn: 'Jón Gunnar Jónsson',
      kyn: { kynKodi: '1' },
      heimilisfang: {
        husHeiti: 'Bessastaðir 1',
        postnumer: '225',
        poststod: 'Álftanes',
      },
    })
    const v2Lookup = jest.spyOn(v2Client, 'getOtherCustodyParents')

    await expect(
      nationalRegistryService.getCustodians(auth, '0101011234'),
    ).resolves.toEqual([user])
    expect(v3Client.getCustodians).toHaveBeenCalledWith('0101011234')
    expect(v2Lookup).not.toHaveBeenCalled()
  })

  describe('getUser', () => {
    it('should return null if nationalRegistry throws an error', async () => {
      jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(null))

      const result = await nationalRegistryService.getUser(
        user.nationalId,
        auth,
      )
      expect(result).toEqual(null)
    })
  })
})
