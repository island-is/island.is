import { AsyncLocalStorage } from 'async_hooks'
import {
  ArgumentsHost,
  CanActivate,
  Catch,
  Controller,
  ExceptionFilter,
  Get,
  Injectable,
  LoggerService,
  MiddlewareConsumer,
  Module,
  NestModule,
  Param,
  ParseUUIDPipe,
  PipeTransform,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { Test } from '@nestjs/testing'
import type { NextFunction, Request, Response } from 'express'
import request from 'supertest'

import { withLoggingContext } from '@island.is/logging'

import { SdfLoggingContextMiddleware } from '../sdf-logging-context.middleware'

// The shared implementation runs the callback in an AsyncLocalStorage scope
// holding the outer context merged with the given one. This stand-in does the
// same over a store the tests can read, and records its calls.
const mockContextStore = new AsyncLocalStorage<Record<string, unknown>>()
jest.mock('@island.is/logging', () => ({
  ...jest.requireActual('@island.is/logging'),
  withLoggingContext: jest.fn(
    (
      context: Record<string, unknown>,
      callback: (...args: unknown[]) => unknown,
      ...args: unknown[]
    ) =>
      mockContextStore.run(
        { ...mockContextStore.getStore(), ...context },
        callback,
        ...args,
      ),
  ),
}))

const APPLICATION_ID = '00000000-0000-0000-0000-000000000001'
const MIXED_CASE_ID = 'ABCDEF01-2345-6789-ABCD-EF0123456789'

describe('SdfLoggingContextMiddleware', () => {
  const middleware = new SdfLoggingContextMiddleware()
  const useWith = (params: Record<string, unknown>) => {
    const next: NextFunction = jest.fn()
    middleware.use({ params } as unknown as Request, {} as Response, next)
    return next
  }

  beforeEach(() => jest.mocked(withLoggingContext).mockClear())

  it('runs the rest of the request inside a context holding the application id', () => {
    const next = useWith({ applicationId: APPLICATION_ID })

    expect(withLoggingContext).toHaveBeenCalledWith(
      { applicationId: APPLICATION_ID },
      expect.any(Function),
    )
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('spells the id in lowercase, as ids are stored', () => {
    const next = useWith({ applicationId: MIXED_CASE_ID })

    expect(withLoggingContext).toHaveBeenCalledWith(
      { applicationId: MIXED_CASE_ID.toLowerCase() },
      expect.any(Function),
    )
    expect(next).toHaveBeenCalledTimes(1)
  })

  it.each([
    ['is not a UUID', { applicationId: 'not-a-uuid' }],
    ['is missing', {}],
    ['is not a string', { applicationId: ['a', 'b'] }],
  ])('adds no context and continues when the id %s', (_label, params) => {
    const next = useWith(params)

    expect(withLoggingContext).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
  })
})

// Requests go through Nest and Express on routes shaped like the SDF ones. The
// stages below record the logging context they run in, which shows that the
// route parameter reaches the middleware and that the context covers guards,
// pipes, exception filters and the framework's own error logging.
describe('SdfLoggingContextMiddleware in a Nest application', () => {
  const observed: Record<string, Record<string, unknown> | undefined> = {}
  const observe = (stage: string) => {
    observed[stage] = mockContextStore.getStore()
  }

  // Leaves a service-style inner context by throwing, as an entry point of the
  // SDF service can.
  const failInsideInnerContext = () =>
    withLoggingContext(
      { templateId: 'TEMPLATE', applicationId: 'set-by-the-service' },
      async () => {
        observe('inner')
        await Promise.resolve()
        throw new Error('failure')
      },
    )

  @Injectable()
  class ObservingGuard implements CanActivate {
    canActivate() {
      observe('guard')
      return true
    }
  }

  class ObservingPipe implements PipeTransform {
    transform(value: string) {
      observe('pipe')
      return value
    }
  }

  @Catch()
  class ObservingFilter implements ExceptionFilter {
    catch(_exception: unknown, host: ArgumentsHost) {
      observe('filter')
      host.switchToHttp().getResponse().status(500).json({})
    }
  }

  @Controller('sdf')
  class ProbeController {
    @Get(':applicationId/ok')
    @UseGuards(ObservingGuard)
    ok(
      @Param('applicationId', new ParseUUIDPipe(), new ObservingPipe())
      applicationId: string,
    ) {
      observe('handler')
      return { applicationId }
    }

    @Get(':applicationId/error-filtered')
    @UseFilters(ObservingFilter)
    errorFiltered() {
      return failInsideInnerContext()
    }

    @Get(':applicationId/error-default')
    errorDefault() {
      return failInsideInnerContext()
    }
  }

  @Module({ controllers: [ProbeController] })
  class ProbeModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(SdfLoggingContextMiddleware).forRoutes(ProbeController)
    }
  }

  const buildApp = async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProbeModule],
    }).compile()
    const app = moduleRef.createNestApplication()
    // Nest's default error handling logs through the application logger.
    const frameworkLogger: LoggerService = {
      log: () => undefined,
      warn: () => undefined,
      debug: () => undefined,
      verbose: () => undefined,
      error: () => observe('framework-error-log'),
    }
    app.useLogger(frameworkLogger)
    await app.init()
    return app
  }

  beforeEach(() => {
    jest.mocked(withLoggingContext).mockClear()
    for (const stage of Object.keys(observed)) {
      delete observed[stage]
    }
  })

  it('runs the guard, the pipe and the handler under the lowercased application id', async () => {
    const app = await buildApp()

    await request(app.getHttpServer())
      .get(`/sdf/${MIXED_CASE_ID}/ok`)
      .expect(200)

    for (const stage of ['guard', 'pipe', 'handler']) {
      expect(observed[stage]).toEqual({
        applicationId: MIXED_CASE_ID.toLowerCase(),
      })
    }
    await app.close()
  })

  it('adds no context when the id in the route is not a UUID', async () => {
    const app = await buildApp()

    await request(app.getHttpServer()).get('/sdf/not-a-uuid/ok').expect(400)

    expect(observed.guard).toBeUndefined()
    expect(withLoggingContext).not.toHaveBeenCalled()
    await app.close()
  })

  it('gives an exception filter the middleware context, not the inner one, after an error escapes', async () => {
    const app = await buildApp()

    await request(app.getHttpServer())
      .get(`/sdf/${APPLICATION_ID}/error-filtered`)
      .expect(500)

    expect(observed.inner).toEqual({
      templateId: 'TEMPLATE',
      applicationId: 'set-by-the-service',
    })
    expect(observed.filter).toEqual({ applicationId: APPLICATION_ID })
    await app.close()
  })

  it("gives Nest's default error logging the middleware context, not the inner one, after an error escapes", async () => {
    const app = await buildApp()

    await request(app.getHttpServer())
      .get(`/sdf/${APPLICATION_ID}/error-default`)
      .expect(500)

    expect(observed['framework-error-log']).toEqual({
      applicationId: APPLICATION_ID,
    })
    await app.close()
  })
})
