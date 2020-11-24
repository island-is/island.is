import { Test, TestingModule } from '@nestjs/testing'

import { LoggingModule } from '@island.is/logging'

import { AuditedAction, AuditTrailService } from './auditTrail.service'

describe('AuditTrailService', () => {
  let service: AuditTrailService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggingModule],
      providers: [AuditTrailService],
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
})
