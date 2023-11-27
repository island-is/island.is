import { Test, TestingModule } from '@nestjs/testing'
import { mock } from 'jest-mock-extended'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import type { Auth, User } from '@island.is/auth-nest-tools'

import { AuditService } from './audit.service'
import SpyInstance = jest.SpyInstance
import { AUDIT_OPTIONS } from './audit.options'

jest.mock('@island.is/logging', () => {
  return {
    Logger: {},
    LOGGER_PROVIDER: 'Logger',
  }
})
const auditLog = mock<Logger>()

jest.mock('winston', () => {
  return {
    createLogger: () => auditLog,
  }
})

jest.mock('winston-cloudwatch', () => {
  return class WinstonCloudWatch {}
})

const defaultNamespace = '@test.is'

const auth = {
  nationalId: '1234567890',
  actor: {
    nationalId: '2234567890',
  },
  client: 'test-client',
  ip: '12.12.12.12',
  userAgent: 'Test agent',
} as User

const appVersion = '101_main_4593096'

describe('AuditService against Cloudwatch', () => {
  const OLD_ENV = process.env
  const genericLogger = mock<Logger>()
  let service: AuditService
  let spy: SpyInstance<Logger> = jest.spyOn(auditLog, 'info')

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: genericLogger,
        },
        {
          provide: AUDIT_OPTIONS,
          useValue: {
            groupName: 'test-group',
            serviceName: 'test-service',
            defaultNamespace,
          },
        },
        AuditService,
      ],
    }).compile()

    spy = jest.spyOn(auditLog, 'info')
    service = module.get<AuditService>(AuditService)
    process.env = { ...OLD_ENV, APP_VERSION: appVersion }
  })

  // Cleanup
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should write to a dedicated audit log', () => {
    // Arrange
    const namespace = '@test.is/namespace'
    const action = 'viewDetails'
    const resources = ['some-id']
    const meta = { test: true }

    // Act
    service.audit({
      auth,
      namespace,
      action,
      resources,
      meta,
    })

    // Assert
    expect(spy).toHaveBeenCalledWith({
      actor: auth.actor?.nationalId,
      subject: auth.nationalId,
      client: [auth.client],
      action: `${namespace}#${action}`,
      resources,
      meta,
      ip: auth.ip,
      userAgent: auth.userAgent,
      appVersion,
    })
  })

  it('assembles client chain correctly', () => {
    // Arrange
    const action = 'viewDetails'

    // Act
    service.audit({
      auth: {
        ...auth,
        act: {
          client_id: 'test-client-3',
          act: {
            client_id: 'test-client-2',
          },
        },
      },
      action,
    })

    // Assert
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        client: [auth.client, 'test-client-2', 'test-client-3'],
      }),
    )
  })

  it('supports default namespace', () => {
    // Arrange
    const action = 'viewDetails'

    // Act
    service.audit({
      auth,
      action,
    })

    // Assert
    expect(spy).toHaveBeenCalledWith({
      actor: auth.actor?.nationalId,
      subject: auth.nationalId,
      client: [auth.client],
      action: `${defaultNamespace}#${action}`,
      ip: auth.ip,
      userAgent: auth.userAgent,
      appVersion,
    })
  })

  it('crashes if namespace is missing', () => {
    // Arrange
    const action = 'viewDetails'

    // Act and assert
    expect(() => {
      service.audit({
        auth,
        namespace: '',
        action,
      })
    }).toThrowError('Audit namespace is required')
  })

  it('supports auditing for auth without nationalId', () => {
    // Arrange
    const action = 'viewDetails'

    const auth: Auth = {
      scope: [],
      authorization: '',
      client: 'machine-client',
      ip: '10.10.10.10',
    }

    // Act
    service.audit({
      auth,
      action,
    })

    // Assert
    expect(spy).toHaveBeenCalledWith({
      client: [auth.client],
      action: `${defaultNamespace}#${action}`,
      ip: auth.ip,
      appVersion,
    })
  })

  it('supports auditing promises with audit templates', async () => {
    // Arrange
    const action = 'viewDetails'
    const result = 'Hello'
    const resources = [result]
    const meta = { result }

    // Act
    await service.auditPromise(
      {
        auth,
        action,
        resources: (result) => result,
        meta: (result) => ({
          result,
        }),
      },
      Promise.resolve(result),
    )

    // Assert
    expect(spy).toHaveBeenCalledWith({
      actor: auth.actor?.nationalId,
      subject: auth.nationalId,
      client: [auth.client],
      action: `${defaultNamespace}#${action}`,
      resources,
      meta,
      ip: auth.ip,
      userAgent: auth.userAgent,
      appVersion,
    })
  })

  it('should be a generic system logger', () => {
    // Arrange
    const action = 'systemAction'

    // Act
    service.audit({
      action,
      system: true,
    })

    // Assert
    expect(spy).toHaveBeenCalledWith({
      action: `${defaultNamespace}#${action}`,
      appVersion,
      system: true,
    })
  })

  it('should support logging to console when not in development mode', () => {
    // Arrange
    const action = 'some_action'

    // Act
    service.audit({
      auth,
      action: 'some_action',
      alsoLog: true,
    })

    // Assert
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        alsoLog: true,
      }),
    )
  })

  it('supports log to console in auditing promises with audit templates when not in development mode', async () => {
    // Act
    await service.auditPromise(
      {
        auth,
        action: 'some_action',
        alsoLog: true,
      },
      Promise.resolve(),
    )

    // Assert
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        alsoLog: true,
      }),
    )
  })
})

describe('AuditService in development', () => {
  const genericLogger = mock<Logger>()
  let service: AuditService
  let spy: SpyInstance<Logger> = jest.spyOn(auditLog, 'info')
  const namespace = '@test.is/namespace'
  const action = 'viewDetails'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: genericLogger,
        },
        {
          provide: AUDIT_OPTIONS,
          useValue: {
            defaultNamespace: '@test.is',
          },
        },
        AuditService,
      ],
    }).compile()
    spy = jest.spyOn(genericLogger, 'info')
    service = module.get<AuditService>(AuditService)
  })

  it('should use generic logger', () => {
    // Arrange
    const resources = ['some-id']
    const meta = { test: true }

    // Act
    service.audit({
      auth,
      namespace,
      action,
      resources,
      meta,
    })

    // Assert
    expect(spy).toHaveBeenCalledWith({
      message: 'Audit record',
      actor: auth.actor?.nationalId,
      subject: auth.nationalId,
      client: [auth.client],
      action: `${namespace}#${action}`,
      resources,
      meta,
      ip: auth.ip,
      userAgent: auth.userAgent,
      appVersion,
    })
  })

  it('should not support logging to console in development mode', () => {
    // Act
    service.audit({
      auth,
      action,
      alsoLog: true,
    })

    // Assert
    expect(spy).not.toHaveBeenCalledWith({
      alsoLog: true,
    })
  })
})
