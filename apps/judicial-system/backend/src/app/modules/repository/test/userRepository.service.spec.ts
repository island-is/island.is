import { Op } from 'sequelize'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { InstitutionType, UserRole } from '@island.is/judicial-system/types'

import { Institution } from '../models/institution.model'
import { User } from '../models/user.model'
import {
  CreateUser,
  UserRepositoryService,
} from '../services/userRepository.service'

describe('UserRepositoryService', () => {
  const userId = 'b1f7e3d1-0000-4000-8000-000000000001'
  const institutionId = 'b1f7e3d1-0000-4000-8000-000000000002'
  const nationalId = '0000000000'
  const include = [{ model: Institution, as: 'institution' }]

  let service: UserRepositoryService
  let logger: { debug: jest.Mock; error: jest.Mock }
  let model: {
    findByPk: jest.Mock
    findAll: jest.Mock
    create: jest.Mock
    update: jest.Mock
  }

  beforeEach(async () => {
    logger = { debug: jest.fn(), error: jest.fn() }

    model = {
      findByPk: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockResolvedValue([0, []]),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: LOGGER_PROVIDER, useValue: logger },
        { provide: getModelToken(User), useValue: model },
        UserRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(UserRepositoryService)
  })

  describe('findById', () => {
    it('loads the user with its institution', async () => {
      const user = { id: userId }
      model.findByPk.mockResolvedValueOnce(user)

      const result = await service.findById(userId)

      expect(model.findByPk).toHaveBeenCalledWith(userId, { include })
      expect(result).toBe(user)
    })

    it('returns null when the user does not exist', async () => {
      model.findByPk.mockResolvedValueOnce(null)

      const result = await service.findById(userId)

      expect(result).toBeNull()
    })

    it('logs and rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findByPk.mockRejectedValueOnce(error)

      await expect(service.findById(userId)).rejects.toBe(error)
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('findActiveByNationalId', () => {
    it('filters on the national id and active users', async () => {
      const users = [{ id: userId }]
      model.findAll.mockResolvedValueOnce(users)

      const result = await service.findActiveByNationalId(nationalId)

      expect(model.findAll).toHaveBeenCalledWith({
        where: { nationalId, active: true },
        include,
      })
      expect(result).toBe(users)
    })

    it('returns an empty list when no user matches', async () => {
      model.findAll.mockResolvedValueOnce([])

      const result = await service.findActiveByNationalId(nationalId)

      expect(result).toEqual([])
    })

    it('keeps the national id out of the logs', async () => {
      const error = new Error('Some error')
      model.findAll.mockRejectedValueOnce(error)

      await expect(service.findActiveByNationalId(nationalId)).rejects.toBe(
        error,
      )
      const logged = [...logger.debug.mock.calls, ...logger.error.mock.calls]
        .flat()
        .map((argument) => JSON.stringify(argument))
        .join(' ')
      expect(logged).not.toContain(nationalId)
    })
  })

  describe('findAllActive', () => {
    it('filters on active users and orders by name', async () => {
      const users = [{ id: userId }]
      model.findAll.mockResolvedValueOnce(users)

      const result = await service.findAllActive()

      expect(model.findAll).toHaveBeenCalledWith({
        order: ['name'],
        where: { active: true },
        include,
      })
      expect(result).toBe(users)
    })

    it('logs and rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findAll.mockRejectedValueOnce(error)

      await expect(service.findAllActive()).rejects.toBe(error)
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('findAllForAdmin', () => {
    it('excludes the given role and narrows to the given institution types', async () => {
      const users = [{ id: userId }]
      model.findAll.mockResolvedValueOnce(users)

      const result = await service.findAllForAdmin(UserRole.LOCAL_ADMIN, [
        InstitutionType.POLICE_PROSECUTORS_OFFICE,
      ])

      expect(model.findAll).toHaveBeenCalledWith({
        order: ['name'],
        where: {
          role: { [Op.not]: UserRole.LOCAL_ADMIN },
          '$institution.type$': [InstitutionType.POLICE_PROSECUTORS_OFFICE],
        },
        include,
      })
      expect(result).toBe(users)
    })

    it('logs and rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findAll.mockRejectedValueOnce(error)

      await expect(
        service.findAllForAdmin(UserRole.ADMIN, Object.values(InstitutionType)),
      ).rejects.toBe(error)
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('findAllActiveWhoCanConfirmIndictments', () => {
    it('filters on active confirmers in the institution', async () => {
      const users = [{ id: userId }]
      model.findAll.mockResolvedValueOnce(users)

      const result = await service.findAllActiveWhoCanConfirmIndictments(
        institutionId,
      )

      expect(model.findAll).toHaveBeenCalledWith({
        where: { active: true, canConfirmIndictment: true, institutionId },
      })
      expect(result).toBe(users)
    })

    it('logs and rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findAll.mockRejectedValueOnce(error)

      await expect(
        service.findAllActiveWhoCanConfirmIndictments(institutionId),
      ).rejects.toBe(error)
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('findAllActiveProsecutors', () => {
    it('filters on active prosecutors in the institution', async () => {
      const users = [{ id: userId }]
      model.findAll.mockResolvedValueOnce(users)

      const result = await service.findAllActiveProsecutors(institutionId)

      expect(model.findAll).toHaveBeenCalledWith({
        where: { active: true, role: UserRole.PROSECUTOR, institutionId },
      })
      expect(result).toBe(users)
    })

    it('logs and rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findAll.mockRejectedValueOnce(error)

      await expect(
        service.findAllActiveProsecutors(institutionId),
      ).rejects.toBe(error)
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('create', () => {
    const userToCreate: CreateUser = {
      nationalId,
      name: 'Guðrún Jónsdóttir',
      title: 'saksóknari',
      mobileNumber: '5555555',
      email: 'gudrun@example.is',
      role: UserRole.PROSECUTOR,
      institutionId,
      active: true,
      canConfirmIndictment: false,
    }

    it('creates the user', async () => {
      const user = { id: userId }
      model.create.mockResolvedValueOnce(user)

      const result = await service.create(userToCreate)

      expect(model.create).toHaveBeenCalledWith({ ...userToCreate })
      expect(result).toBe(user)
    })

    it('logs and rethrows without the created user in the message', async () => {
      const error = new Error('Some error')
      model.create.mockRejectedValueOnce(error)

      await expect(service.create(userToCreate)).rejects.toBe(error)
      expect(logger.error).toHaveBeenCalledWith('Error creating a user:', {
        error,
      })
    })
  })

  describe('updateById', () => {
    it('returns the affected row count and rows as a named object', async () => {
      const user = { id: userId }
      model.update.mockResolvedValueOnce([1, [user]])

      const result = await service.updateById(userId, { name: 'Nýtt nafn' })

      expect(model.update).toHaveBeenCalledWith(
        { name: 'Nýtt nafn' },
        { where: { id: userId }, returning: true },
      )
      expect(result).toEqual({ numberOfAffectedRows: 1, users: [user] })
    })

    it('reports no affected rows without throwing', async () => {
      model.update.mockResolvedValueOnce([0, []])

      const result = await service.updateById(userId, { active: false })

      expect(result).toEqual({ numberOfAffectedRows: 0, users: [] })
    })

    it('logs and rethrows when the update fails', async () => {
      const error = new Error('Some error')
      model.update.mockRejectedValueOnce(error)

      await expect(service.updateById(userId, { active: false })).rejects.toBe(
        error,
      )
      expect(logger.error).toHaveBeenCalled()
    })
  })
})
