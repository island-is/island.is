import { mock } from 'jest-mock-extended'

import { Test, TestingModule } from '@nestjs/testing'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import { auditTrailModuleConfig } from './auditTrail.config'
import {
  AuditedAction,
  AuditedRequestStatus,
  AuditTrailService,
} from './auditTrail.service'

jest.mock('@island.is/logging', () => {
  return {
    Logger: {},
    LOGGER_PROVIDER: 'Logger',
  }
})
const auditTrail = mock<Logger>()
jest.mock('winston', () => {
  return {
    createLogger: () => auditTrail,
  }
})
jest.mock('winston-cloudwatch', () => {
  return class WinstonCloudWatch {}
})

describe('AuditTrailService generic', () => {
  const genericLogger = mock<Logger>()
  let service: AuditTrailService

  process.env.AUDIT_TRAIL_USE_GENERIC_LOGGER = 'true'
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [auditTrailModuleConfig],
        }),
      ],
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: genericLogger,
        },
        AuditTrailService,
      ],
    }).compile()

    service = module.get<AuditTrailService>(AuditTrailService)
  })

  it('should use generic logger', async () => {
    // Arrange
    const spy = jest.spyOn(genericLogger, 'info')
    const userId = 'some-user-id'
    const action = AuditedAction.GET_CASE
    const id = 'some-id'
    const details = { requestStatus: AuditedRequestStatus.COMPLETED }

    // Act
    await service.audit(userId, action, null, id)

    // Assert
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        user: userId,
        action,
        entities: id,
        details,
      }),
    )
  })

  it('should log a single id', async () => {
    // Arrange
    const spy = jest.spyOn(genericLogger, 'info')
    const userId = 'some-user-id'
    const action = AuditedAction.GET_CASE
    const id = 'some-id'
    const result = 'some-result'
    const details = { requestStatus: AuditedRequestStatus.COMPLETED }

    // Act
    const res = await service.audit(userId, action, result, id)

    // Assert
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        user: userId,
        action,
        entities: id,
        details,
      }),
    )
    expect(res).toBe(result)
  })

  it('should log an id from result', async () => {
    // Arrange
    const spy = jest.spyOn(genericLogger, 'info')
    const userId = 'some-user-id'
    const action = AuditedAction.GET_CASE
    const id = 'some-id'
    const result = 'some-result'
    const details = { requestStatus: AuditedRequestStatus.COMPLETED }
    const idFromResult = jest.fn().mockReturnValue(id)

    // Act
    const res = await service.audit(userId, action, result, idFromResult)

    // Assert
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        user: userId,
        action,
        entities: id,
        details,
      }),
    )
    expect(idFromResult).toHaveBeenCalledWith(result)
    expect(res).toBe(result)
  })

  it('should log an id from a promised result', async () => {
    // Arrange
    const spy = jest.spyOn(genericLogger, 'info')
    const userId = 'some-user-id'
    const action = AuditedAction.GET_CASE
    const id = 'some-id'
    const result = 'some-result'
    const details = { requestStatus: AuditedRequestStatus.COMPLETED }
    const idFromResult = jest.fn().mockReturnValue(id)

    // Act
    const res = await service.audit(
      userId,
      action,
      Promise.resolve(result),
      idFromResult,
    )

    // Assert
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        user: userId,
        action,
        entities: id,
        details,
      }),
    )
    expect(idFromResult).toHaveBeenCalledWith(result)
    expect(res).toBe(result)
  })

  it('should log a rejection from a promised result', async () => {
    // Arrange
    const spy = jest.spyOn(genericLogger, 'info')
    const userId = 'some-user-id-xxx'
    const action = AuditedAction.GET_CASE
    const id = 'some-id'
    const details = { requestStatus: AuditedRequestStatus.COMPLETED }

    const idFromResult = jest.fn().mockReturnValue(id)

    // Act and assert
    await expect(
      service.audit(userId, action, Promise.reject('Rejected'), idFromResult),
    ).rejects.toBe('Rejected')
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        user: userId,
        action,
        entities: undefined,
        details,
        error: 'Rejected',
      }),
    )
  })

  it('should log a single id and a rejection from a promised result', async () => {
    // Arrange
    const spy = jest.spyOn(genericLogger, 'info')
    const userId = 'some-user-id-xxx'
    const action = AuditedAction.GET_CASE
    const id = 'some-id'
    const details = { requestStatus: AuditedRequestStatus.COMPLETED }

    // Act and assert
    await expect(
      service.audit(userId, action, Promise.reject('Rejected'), id),
    ).rejects.toBe('Rejected')
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        user: userId,
        action,
        entities: id,
        details,
        error: 'Rejected',
      }),
    )
  })
})

describe('AuditTrailService generic', () => {
  const genericLogger = mock<Logger>()
  let service: AuditTrailService

  beforeEach(async () => {
    process.env.AUDIT_TRAIL_USE_GENERIC_LOGGER = undefined
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [auditTrailModuleConfig],
        }),
      ],
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: genericLogger,
        },
        AuditTrailService,
      ],
    }).compile()

    service = module.get<AuditTrailService>(AuditTrailService)
  })

  it('should write to a dedicated audit trail', async () => {
    // Arrange
    const spy = jest.spyOn(auditTrail, 'info')
    const userId = 'some-user-id'
    const action = AuditedAction.GET_CASE
    const id = 'some-id'
    const details = { requestStatus: AuditedRequestStatus.COMPLETED }

    // Act
    await service.audit(userId, action, null, id)

    // Assert
    expect(spy).toHaveBeenCalledWith({
      user: userId,
      action,
      entities: id,
      details,
    })
  })
})
