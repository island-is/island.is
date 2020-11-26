import { mock } from 'jest-mock-extended'

import { Test, TestingModule } from '@nestjs/testing'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { AuditedAction, AuditTrailService } from './auditTrail.service'

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

describe('AuditTrailService', () => {
  const genericLogger = mock<Logger>()
  let service: AuditTrailService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should throw an exception if not initialized', () => {
    // Arrange
    const userId = 'some-user-id'
    const action = AuditedAction.OVERVIEW
    const caseIds = ['some-case-id', 'another-case-id']
    const act = () => {
      service.audit(userId, action, caseIds)
    }

    // Act and assert
    expect(act).toThrowError(ReferenceError)
  })

  it('should write to a dedicated audit trail', () => {
    // Arrange
    const spy = jest.spyOn(auditTrail, 'info')
    const userId = 'some-user-id'
    const action = AuditedAction.VIEW_DETAILS
    const caseId = 'some-case-id'
    service.initTrail({ useGenericLogger: false })

    // Act
    service.audit(userId, action, caseId)

    // Assert
    expect(spy).toHaveBeenCalledWith('Audit', {
      user: userId,
      action,
      cases: caseId,
    })

    // Cleanup
    spy.mockReset()
    spy.mockRestore()
  })

  it('should use generic logger', () => {
    // Arrange
    const spy = jest.spyOn(genericLogger, 'info')
    const userId = 'some-user-id'
    const action = AuditedAction.VIEW_DETAILS
    const caseId = 'some-case-id'
    service.initTrail({ useGenericLogger: true })

    // Act
    service.audit(userId, action, caseId)

    // Assert
    expect(spy).toHaveBeenCalledWith('Audit', {
      user: userId,
      action,
      cases: caseId,
    })

    // Cleanup
    spy.mockReset()
    spy.mockRestore()
  })
})
