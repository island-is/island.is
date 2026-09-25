import { Test, TestingModule } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { UserRole } from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { authModuleConfig } from './auth.config'
import { AuthService } from './auth.service'

const nationalId = '1234567890'
const lawyerRegistryInfo = {
  id: 'lawyer-registry-row',
  nationalId,
  name: 'Registry Lawyer',
  email: 'registry@example.com',
  phoneNr: '5555555',
  practice: 'Reykjavík',
  isLitigator: true,
}

const staffUser = {
  id: 'staff-id',
  created: '2024-01-01',
  modified: '2024-01-01',
  nationalId,
  name: 'Staff User',
  title: 'saksóknari',
  mobileNumber: '2222222',
  email: 'staff@example.com',
  role: UserRole.PROSECUTOR,
  active: true,
  canConfirmIndictment: true,
}

const notFoundError = { problem: { status: 404 } }

describe('AuthService - findEligibleUsersByNationalId', () => {
  let service: AuthService
  let mockBackendService: {
    findUsersByNationalId: jest.Mock
    getLawyer: jest.Mock
  }

  beforeEach(async () => {
    mockBackendService = {
      findUsersByNationalId: jest.fn().mockRejectedValue(notFoundError),
      getLawyer: jest.fn().mockRejectedValue(notFoundError),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: BackendService, useValue: mockBackendService },
        {
          provide: LOGGER_PROVIDER,
          useValue: { info: jest.fn(), error: jest.fn() },
        },
        {
          provide: authModuleConfig.KEY,
          useValue: {
            clientId: 'test',
            clientSecret: 'test',
            redirectUri: 'http://localhost',
            issuer: 'http://localhost',
          },
        },
      ],
    }).compile()

    service = module.get(AuthService)
  })

  it('returns staff users without checking the lawyer registry', async () => {
    mockBackendService.findUsersByNationalId.mockResolvedValueOnce([staffUser])

    const result = await service.findEligibleUsersByNationalId(nationalId)

    expect(result).toEqual([staffUser])
    expect(mockBackendService.getLawyer).not.toHaveBeenCalled()
  })

  it('returns a defender from the lawyer registry', async () => {
    mockBackendService.getLawyer.mockResolvedValueOnce(lawyerRegistryInfo)

    const result = await service.findEligibleUsersByNationalId(nationalId)

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      nationalId,
      name: lawyerRegistryInfo.name,
      role: UserRole.DEFENDER,
      email: lawyerRegistryInfo.email,
      mobileNumber: lawyerRegistryInfo.phoneNr,
      active: true,
      title: 'verjandi',
    })
  })

  it('denies access when the national id is not on the lawyer registry', async () => {
    const result = await service.findEligibleUsersByNationalId(nationalId)

    expect(result).toEqual([])
  })
})
