import { mock } from 'jest-mock-extended'

import { Test, TestingModule } from '@nestjs/testing'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  AuditedAction,
  AuditTrailService,
  AUDIT_TRAIL_OPTIONS,
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
    default: {
      createLogger: () => auditTrail,
    },
  }
})
jest.mock('winston-cloudwatch', () => {
  return {
    default: class WinstonCloudWatch {},
  }
})

describe('AuditTrailService generic', () => {
  const genericLogger = mock<Logger>()
  let service: AuditTrailService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AUDIT_TRAIL_OPTIONS,
          useFactory: () => ({ useGenericLogger: true }),
        },
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

    // Act
    await service.audit(userId, action, null, id)

    // Assert
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        user: userId,
        action,
        entities: id,
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

    // Act
    const res = await service.audit(userId, action, result, id)

    // Assert
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        user: userId,
        action,
        entities: id,
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
    const idFromResult = jest.fn().mockReturnValue(id)

    // Act
    const res = await service.audit(userId, action, result, idFromResult)

    // Assert
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        user: userId,
        action,
        entities: id,
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
      }),
    )
    expect(idFromResult).toHaveBeenCalledWith(result)
    expect(res).toBe(result)
  })
})

describe('AuditTrailService generic', () => {
  const genericLogger = mock<Logger>()
  let service: AuditTrailService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AUDIT_TRAIL_OPTIONS,
          useFactory: () => ({ useGenericLogger: false }),
        },
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

    // Act
    await service.audit(userId, action, null, id)

    // Assert
    expect(spy).toHaveBeenCalledWith({
      user: userId,
      action,
      entities: id,
    })
  })
})
