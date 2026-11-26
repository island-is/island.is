import { User } from '@island.is/auth-nest-tools'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { NationalRegistryV3ApplicationsClientService } from '@island.is/clients/national-registry-v3-applications'
import { Test } from '@nestjs/testing'
import { NationalRegistryResolver } from './nationalRegistry.resolver'

describe('NationalRegistryResolver custody children', () => {
  const getCustodyChildren = jest.fn()
  const getOtherIndividual = jest.fn()
  const getAllDataIndividual = jest.fn()
  const user = { nationalId: '0101902989' } as User
  let resolver: NationalRegistryResolver

  beforeEach(async () => {
    jest.resetAllMocks()
    const module = await Test.createTestingModule({
      providers: [
        NationalRegistryResolver,
        {
          provide: NationalRegistryV3ClientService,
          useValue: { getAllDataIndividual },
        },
        {
          provide: NationalRegistryV3ApplicationsClientService,
          useValue: { getCustodyChildren, getOtherIndividual },
        },
      ],
    }).compile()
    resolver = module.get(NationalRegistryResolver)
  })

  it('uses the authenticated user and only the applications client', async () => {
    getCustodyChildren.mockResolvedValue(['0101202989', '0101212989'])
    getOtherIndividual
      .mockResolvedValueOnce({ name: 'Child' })
      .mockResolvedValueOnce(null)

    await expect(resolver.getCustodyChildren(user)).resolves.toEqual([
      { nationalId: '0101202989', fullName: 'Child' },
      { nationalId: '0101212989', fullName: null },
    ])
    expect(getCustodyChildren).toHaveBeenCalledWith(user)
    expect(getOtherIndividual).toHaveBeenCalledTimes(2)
    expect(getOtherIndividual).toHaveBeenCalledWith('0101202989', user)
    expect(getOtherIndividual).toHaveBeenCalledWith('0101212989', user)
    expect(getAllDataIndividual).not.toHaveBeenCalled()
  })

  it('does not request person details for an empty custody list', async () => {
    getCustodyChildren.mockResolvedValue([])
    await expect(resolver.getCustodyChildren(user)).resolves.toEqual([])
    expect(getOtherIndividual).not.toHaveBeenCalled()
  })

  it('propagates lookup errors instead of reporting an empty list', async () => {
    getCustodyChildren.mockRejectedValue(new Error('Registry unavailable'))
    await expect(resolver.getCustodyChildren(user)).rejects.toThrow(
      'Registry unavailable',
    )
  })

  it('propagates name lookup errors instead of caching incomplete results', async () => {
    getCustodyChildren.mockResolvedValue(['0101202989'])
    getOtherIndividual.mockRejectedValue(new Error('Name lookup unavailable'))
    await expect(resolver.getCustodyChildren(user)).rejects.toThrow(
      'Name lookup unavailable',
    )
  })
})
