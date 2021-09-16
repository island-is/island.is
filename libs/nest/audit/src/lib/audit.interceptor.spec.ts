/* eslint-disable @typescript-eslint/no-empty-function */
import { mock } from 'jest-mock-extended'
import { Test, TestingModule } from '@nestjs/testing'
import { of, lastValueFrom } from 'rxjs'

import { getCurrentUser } from '@island.is/auth-nest-tools'

import { AuditService } from './audit.service'
import { AuditInterceptor } from './audit.interceptor'
import { Audit } from './audit.decorator'
import MockInstance = jest.MockInstance

jest.mock('@island.is/auth-nest-tools', () => ({
  getCurrentUser: jest.fn(),
}))

const context: any = {
  getHandler: jest.fn(),
  getClass: jest.fn(),
}

const next = {
  handle: jest.fn(() => of('hello')),
}

describe('AuditInterceptor', () => {
  const auditService = mock<AuditService>()
  let interceptor: AuditInterceptor

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuditService,
          useValue: auditService,
        },
        AuditInterceptor,
      ],
    }).compile()

    interceptor = module.get<AuditInterceptor>(AuditInterceptor)
  })

  // Cleanup
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('logs to audit log', async () => {
    // Arrange
    class MyClass {
      @Audit()
      handler() {}
    }
    context.getClass.mockReturnValue(MyClass)
    context.getHandler.mockReturnValue(MyClass.prototype.handler)

    // Act
    const observable = interceptor.intercept(context, next)
    await lastValueFrom(observable)

    // Assert
    expect(auditService.auditPromise).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'handler',
      }),
      expect.anything(),
    )
  })

  it('merges content from class decorator', async () => {
    // Arrange
    @Audit({ namespace: '@test.is' })
    class MyClass {
      @Audit({ action: 'test' })
      handler() {}
    }
    context.getClass.mockReturnValue(MyClass)
    context.getHandler.mockReturnValue(MyClass.prototype.handler)

    // Act
    const observable = interceptor.intercept(context, next)
    await lastValueFrom(observable)

    // Assert
    expect(auditService.auditPromise).toHaveBeenCalledWith(
      expect.objectContaining({
        namespace: '@test.is',
        action: 'test',
      }),
      expect.anything(),
    )
  })

  it('forwards next result', async () => {
    // Arrange
    class MyClass {
      @Audit()
      handler() {}
    }
    context.getClass.mockReturnValue(MyClass)
    context.getHandler.mockReturnValue(MyClass.prototype.handler)
    const result = 'testResult'
    next.handle.mockReturnValue(of(result))

    // Act
    const observable = interceptor.intercept(context, next)
    await lastValueFrom(observable)

    // Assert
    expect(auditService.auditPromise).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Promise),
    )
    await expect(auditService.auditPromise.mock.calls[0][1]).resolves.toEqual(
      result,
    )
  })

  it('forwards user', async () => {
    // Arrange
    class MyClass {
      @Audit()
      handler() {}
    }
    context.getClass.mockReturnValue(MyClass)
    context.getHandler.mockReturnValue(MyClass.prototype.handler)
    const user = 'Test user'
    const getCurrentUserMock = (getCurrentUser as unknown) as MockInstance<
      string,
      unknown[]
    >
    getCurrentUserMock.mockReturnValue(user)

    // Act
    const observable = interceptor.intercept(context, next)
    await lastValueFrom(observable)

    // Assert
    expect(auditService.auditPromise).toHaveBeenCalledWith(
      expect.objectContaining({
        user,
      }),
      expect.anything(),
    )
  })

  it('does not audit if handler has no Audit decorator', async () => {
    // Arrange
    @Audit()
    class MyClass {
      handler() {}
    }
    context.getClass.mockReturnValue(MyClass)
    context.getHandler.mockReturnValue(MyClass.prototype.handler)

    // Act
    const observable = interceptor.intercept(context, next)
    await lastValueFrom(observable)

    // Assert
    expect(auditService.auditPromise).toBeCalledTimes(0)
  })
})
