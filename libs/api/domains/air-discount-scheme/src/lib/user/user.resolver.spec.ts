import { Test } from '@nestjs/testing'

import { ApiScope } from '@island.is/auth/scopes'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { AuditService } from '@island.is/nest/audit'

import { User } from '../models/user.model'
import { UserResolver } from './user.resolver'

describe('ApiDomains: UserResolver', () => {
  let resolver: UserResolver
  const getAddress = jest.fn()
  const audit = jest.fn()

  const auth: AuthUser = {
    authorization: '',
    client: '',
    nationalId: '1010303019',
    scope: [ApiScope.internal],
  }

  const fabUser = (nationalId: string): User => ({
    nationalId,
    name: 'Bergvin Bóason',
  })

  beforeEach(async () => {
    getAddress.mockReset()
    audit.mockReset()

    const module = await Test.createTestingModule({
      providers: [
        UserResolver,
        { provide: NationalRegistryV3ClientService, useValue: { getAddress } },
        { provide: AuditService, useValue: { audit } },
      ],
    }).compile()

    resolver = module.get(UserResolver)
  })

  it('returns null for anyone other than the signed-in person', async () => {
    const address = await resolver.resolveAddress(fabUser('2222222229'), auth)

    expect(address).toBeNull()
    expect(getAddress).not.toHaveBeenCalled()
    expect(audit).not.toHaveBeenCalled()
  })

  it("maps the signed-in person's address", async () => {
    getAddress.mockResolvedValue({
      husHeiti: 'Neinsstaðarból 18',
      ibud: null,
      postnumer: '200',
      poststod: 'Kópavogur',
      sveitarfelag: 'Kópavogsbær',
    })

    const address = await resolver.resolveAddress(
      fabUser(auth.nationalId),
      auth,
    )

    expect(getAddress).toHaveBeenCalledWith(auth.nationalId)
    expect(audit).toHaveBeenCalledTimes(1)
    expect(address).toEqual(
      expect.objectContaining({
        municipalityText: 'Kópavogsbær',
        postalCode: '200',
      }),
    )
  })

  it('returns null when the registry call fails', async () => {
    getAddress.mockRejectedValue(new Error('Service unavailable'))

    const address = await resolver.resolveAddress(
      fabUser(auth.nationalId),
      auth,
    )

    expect(address).toBeNull()
  })

  it('returns null when the registry has no address', async () => {
    getAddress.mockResolvedValue(null)

    const address = await resolver.resolveAddress(
      fabUser(auth.nationalId),
      auth,
    )

    expect(address).toBeNull()
  })
})
