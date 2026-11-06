import { Test } from '@nestjs/testing'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { NationalRegistryService } from '../../nationalRegistry.service'
import { NationalRegistryUser } from '../../nationalRegistry.types'

import { AirDiscountSchemeScope } from '@island.is/auth/scopes'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'

const user: NationalRegistryUser = {
  nationalId: '1306886513',
  givenName: 'Jón Gunnar',
  fullName: 'Jón Gunnar Jónsson',
  gender: 'kk',
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
  const v3Client = {
    getAllDataIndividual: jest.fn(),
    getCustodians: jest.fn(),
  }
  beforeEach(async () => {
    v3Client.getAllDataIndividual.mockReset()
    v3Client.getCustodians.mockReset()
    const moduleRef = await Test.createTestingModule({
      providers: [
        NationalRegistryService,
        {
          provide: NationalRegistryV3ClientService,
          useValue: v3Client,
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
  })

  describe('getRelations', () => {
    it('reads custody children from v3', async () => {
      v3Client.getAllDataIndividual.mockResolvedValue({
        forsja: {
          born: [{ barnKennitala: '0101011234' }, { barnKennitala: null }],
        },
      })

      await expect(nationalRegistryService.getRelations(auth)).resolves.toEqual(
        ['0101011234'],
      )
      expect(v3Client.getAllDataIndividual).toHaveBeenCalledWith(
        auth.nationalId,
      )
    })
  })

  it.each([
    ['225', 225],
    ['225abc', 0],
    ['abc', 0],
    [undefined, 0],
  ])('maps custodian postal code %s to %i', async (postnumer, postalcode) => {
    v3Client.getCustodians.mockResolvedValue([
      { forsjaAdiliKennitala: '1306886513' },
      { forsjaAdiliKennitala: null },
    ])
    v3Client.getAllDataIndividual.mockResolvedValue({
      kennitala: '1306886513',
      nafn: 'Jón Gunnar Jónsson',
      fulltNafn: {
        eiginNafn: 'Jón Gunnar',
        milliNafn: null,
        kenniNafn: 'Jónsson',
        fulltNafn: 'Jón Gunnar Jónsson',
      },
      kyn: { kynKodi: '1' },
      heimilisfang: {
        husHeiti: 'Bessastaðir 1',
        postnumer,
        poststod: 'Álftanes',
      },
    })
    await expect(
      nationalRegistryService.getCustodians('0101011234'),
    ).resolves.toEqual([{ ...user, postalcode }])
    expect(v3Client.getCustodians).toHaveBeenCalledWith('0101011234')
  })

  describe('getUser', () => {
    it('should return null if nationalRegistry throws an error', async () => {
      jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(null))

      const result = await nationalRegistryService.getUser(user.nationalId)
      expect(result).toEqual(null)
    })

    it.each([
      [
        'no millinafn',
        {
          eiginNafn: 'Jón Gunnar',
          milliNafn: null,
          kenniNafn: 'Jónsson',
          fulltNafn: 'Jón Gunnar Jónsson',
        },
        'Jón Gunnar Jónsson',
        'Jón Gunnar',
        'Jón Gunnar Jónsson',
      ],
      [
        'registered millinafn',
        {
          eiginNafn: 'Jón Gunnar',
          milliNafn: 'Hólm',
          kenniNafn: 'Jónsson',
          fulltNafn: 'Jón Gunnar Hólm Jónsson',
        },
        'Jón Gunnar Hólm Jónsson',
        'Jón Gunnar',
        'Jón Gunnar Hólm Jónsson',
      ],
      [
        'no fulltNafn',
        undefined,
        'Jón Gunnar Jónsson',
        '',
        'Jón Gunnar Jónsson',
      ],
    ])(
      'maps names for %s',
      async (_case, fulltNafn, nafn, givenName, fullName) => {
        v3Client.getAllDataIndividual.mockResolvedValue({
          kennitala: '0000000000',
          nafn,
          fulltNafn,
          kyn: { kynKodi: '1' },
        })

        const result = await nationalRegistryService.getUser('0000000000')
        expect(result).toEqual(expect.objectContaining({ givenName, fullName }))
        expect(result).not.toHaveProperty('middleName')
      },
    )
  })
})
