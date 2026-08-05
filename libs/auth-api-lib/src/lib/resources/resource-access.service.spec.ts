import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ResourceAccessService } from './resource-access.service'
import { ApiScope } from './models/api-scope.model'
import { ApiScopeUser } from './models/api-scope-user.model'
import { ApiScopeUserAccess } from './models/api-scope-user-access.model'

const mockApiScopeModel = {
  findOne: jest.fn(),
}

const mockApiScopeUserModel = {
  findByPk: jest.fn(),
}

const mockApiScopeUserAccessModel = {
  destroy: jest.fn(),
  create: jest.fn(),
  findOrCreate: jest.fn(),
}

const mockLogger = {
  debug: jest.fn(),
}

describe('ResourceAccessService', () => {
  let service: ResourceAccessService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceAccessService,
        {
          provide: getModelToken(ApiScope),
          useValue: mockApiScopeModel,
        },
        {
          provide: getModelToken(ApiScopeUser),
          useValue: mockApiScopeUserModel,
        },
        {
          provide: getModelToken(ApiScopeUserAccess),
          useValue: mockApiScopeUserAccessModel,
        },
        {
          provide: LOGGER_PROVIDER,
          useValue: mockLogger,
        },
      ],
    }).compile()

    service = module.get(ResourceAccessService)

    jest.clearAllMocks()
  })

  describe('update', () => {
    const nationalId = '0123456789'

    const mockUser = {
      update: jest.fn(),
      nationalId,
      name: 'Test User',
      email: 'test@example.com',
    }

    beforeEach(() => {
      mockApiScopeUserModel.findByPk.mockResolvedValue(mockUser)
    })

    it('should not delete or create scopes when userAccess is undefined', async () => {
      await service.update({ name: 'Updated Name' }, nationalId)

      expect(mockUser.update).toHaveBeenCalledWith({ name: 'Updated Name' })
      expect(mockApiScopeUserAccessModel.destroy).not.toHaveBeenCalled()
      expect(mockApiScopeUserAccessModel.create).not.toHaveBeenCalled()
    })

    it('should clear scopes when userAccess is an empty array', async () => {
      await service.update({ userAccess: [] }, nationalId)

      expect(mockApiScopeUserAccessModel.destroy).toHaveBeenCalledWith({
        where: { nationalId },
      })
      // createUserScopes with [] calls no creates
      expect(mockApiScopeUserAccessModel.create).not.toHaveBeenCalled()
    })

    it('should replace scopes when userAccess is provided', async () => {
      const userAccess = [{ nationalId, scope: 'scope1' }]
      mockApiScopeUserAccessModel.findOrCreate.mockResolvedValue([
        userAccess[0],
        true,
      ])

      await service.update({ userAccess }, nationalId)

      expect(mockApiScopeUserAccessModel.destroy).toHaveBeenCalledWith({
        where: { nationalId },
      })
      expect(mockApiScopeUserAccessModel.findOrCreate).toHaveBeenCalledWith({
        where: { nationalId, scope: 'scope1' },
      })
    })
  })
})
