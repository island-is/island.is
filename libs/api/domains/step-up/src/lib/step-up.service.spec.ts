import { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GraphQLError } from 'graphql'

import type { User } from '@island.is/auth-nest-tools'
import type { CibaClient, CibaPollResult } from '@island.is/auth/step-up'
import type { Logger } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'
import {
  Features,
  type FeatureFlagService,
} from '@island.is/nest/feature-flags'

import { StepUpConfig } from './step-up.config'
import { StepUpGuard, StepUpRequired } from './step-up.guard'
import { StepUpErrorCode, StepUpService } from './step-up.service'
import { MemoryStepUpStore } from './step-up.store'

const person = '0101302989'

const config: ConfigType<typeof StepUpConfig> = {
  issuer: 'https://innskra.island.is',
  clientId: '@island.is/clients/step-up',
  clientSecret: 'secret',
  scope: 'openid @island.is/auth/step-up',
  requiredAcr: 'eidas-loa-high',
  allowAnyAcrInDev: false,
  clients: ['@island.is/app'],
  idleSeconds: 15 * 60,
  maxSeconds: 12 * 60 * 60,
  maxStarts: 2,
  maxStartsWindowSeconds: 15 * 60,
  bindingMessage: 'Opna viðkvæmar upplýsingar í Ísland.is appinu',
  redis: { nodes: [], ssl: false },
}

const appUser = (overrides: Partial<User> = {}): User =>
  ({
    nationalId: person,
    client: '@island.is/app',
    sid: 'session-1',
    authorization: 'Bearer app-token',
    amr: ['swk', 'pin'],
    scope: [],
    ...overrides,
  } as User)

describe('StepUpService', () => {
  let now: number
  let store: MemoryStepUpStore
  let ciba: { start: jest.Mock; poll: jest.Mock }
  let service: StepUpService

  const approve = (
    claims: Partial<
      Extract<CibaPollResult, { status: 'authenticated' }>['claims']
    > = {},
  ) =>
    ciba.poll.mockResolvedValue({
      status: 'authenticated',
      claims: {
        sub: 'subject-1',
        nationalId: person,
        acr: 'eidas-loa-high',
        amr: ['swk'],
        authTime: new Date(now),
        ...claims,
      },
    })

  const advance = (seconds: number) => {
    now += seconds * 1000
  }

  beforeEach(() => {
    now = Date.UTC(2026, 9, 4, 12)
    jest.spyOn(Date, 'now').mockImplementation(() => now)
    store = new MemoryStepUpStore(() => now)
    ciba = {
      start: jest.fn().mockResolvedValue({
        authReqId: 'req-1',
        method: 'app',
        expiresIn: 300,
        interval: 5,
        verificationCode: '4821',
      }),
      poll: jest.fn().mockResolvedValue({ status: 'pending' }),
    }
    service = new StepUpService(ciba as unknown as CibaClient, store, config, {
      warn: jest.fn(),
    } as unknown as Logger)
  })

  afterEach(() => jest.restoreAllMocks())

  it("asks the identity server to authenticate the person behind the session's own token", async () => {
    const started = await service.start(appUser())

    // No method named: the identity server goes by how the session behind the
    // token was logged in.
    expect(ciba.start).toHaveBeenCalledWith({
      userToken: 'Bearer app-token',
      bindingMessage: config.bindingMessage,
    })
    expect(started).toMatchObject({
      method: 'app',
      verificationCode: '4821',
      interval: 5,
      expiresIn: 300,
    })
  })

  it('is locked until the person approves, then unlocked', async () => {
    const user = appUser()
    const { stepUpId } = await service.start(user)

    expect(await service.status(user, stepUpId)).toBe('pending')
    expect((await service.session(user)).unlocked).toBe(false)

    approve()
    expect(await service.status(user, stepUpId)).toBe('confirmed')
    expect((await service.session(user)).unlocked).toBe(true)
    expect(await service.useUnlock(user)).toBe(true)

    // Asking again answers the same, without asking the identity server.
    expect(await service.status(user, stepUpId)).toBe('confirmed')
    expect(ciba.poll).toHaveBeenCalledTimes(2)
  })

  it("does not tell another session about someone's step-up", async () => {
    const { stepUpId } = await service.start(appUser())
    approve()

    expect(await service.status(appUser({ sid: 'other' }), stepUpId)).toBe(
      'expired',
    )
    expect(ciba.poll).not.toHaveBeenCalled()
  })

  it.each([
    ['someone else', { nationalId: '0101303019' }],
    ['a weaker assurance level', { acr: 'eidas-loa-substantial' }],
    ['an authentication from before the start', { authTime: new Date(0) }],
  ])('refuses an approval by %s', async (_, claims) => {
    const user = appUser()
    const { stepUpId } = await service.start(user)
    approve(claims)

    expect(await service.status(user, stepUpId)).toBe('denied')
    expect(await service.useUnlock(user)).toBe(false)
  })

  it.each([
    ['denied', 'denied'],
    ['expired', 'timed_out'],
  ] as const)('reports %s as %s', async (pollStatus, status) => {
    const user = appUser()
    const { stepUpId } = await service.start(user)
    ciba.poll.mockResolvedValue({ status: pollStatus })

    expect(await service.status(user, stepUpId)).toBe(status)
  })

  it('locks again after a while unused', async () => {
    const user = appUser()
    const { stepUpId } = await service.start(user)
    approve()
    await service.status(user, stepUpId)

    advance(config.idleSeconds - 1)
    expect(await service.useUnlock(user)).toBe(true)

    // Use kept it alive; a full idle period without use does not.
    advance(config.idleSeconds - 1)
    expect(await service.useUnlock(user)).toBe(true)
    advance(config.idleSeconds + 1)
    expect(await service.useUnlock(user)).toBe(false)
  })

  it('locks again after the absolute limit, however busy', async () => {
    const user = appUser()
    const { stepUpId } = await service.start(user)
    approve()
    await service.status(user, stepUpId)

    for (let used = 0; used < config.maxSeconds; used += 600) {
      advance(600)
      await service.useUnlock(user)
    }

    expect(await service.useUnlock(user)).toBe(false)
  })

  it('locks straight away when asked', async () => {
    const user = appUser()
    const { stepUpId } = await service.start(user)
    approve()
    await service.status(user, stepUpId)

    await service.lock(user)

    expect(await service.useUnlock(user)).toBe(false)
  })

  it('keeps the unlock when switching to act for someone else', async () => {
    const user = appUser()
    const { stepUpId } = await service.start(user)
    approve()
    await service.status(user, stepUpId)

    const actingForChild = appUser({
      nationalId: '1212121219',
      actor: { nationalId: person, scope: [] },
    })
    expect(await service.useUnlock(actingForChild)).toBe(true)
  })

  it('caps how many unlocks can be started', async () => {
    await service.start(appUser())
    await service.start(appUser())

    await expect(service.start(appUser())).rejects.toMatchObject({
      extensions: { code: StepUpErrorCode.TooManyAttempts },
    })
  })

  it('is not offered to other clients', async () => {
    await expect(
      service.start(appUser({ client: '@island.is/web' })),
    ).rejects.toMatchObject({
      extensions: { code: StepUpErrorCode.NotAvailable },
    })
  })
})

describe('StepUpGuard', () => {
  class Locked {
    @StepUpRequired(Features.isAppHealthStepUpRequired)
    handler() {
      return 'data'
    }
  }

  const context = (user?: User) =>
    ({
      getHandler: () => Locked.prototype.handler,
      getClass: () => Locked,
      switchToHttp: () => ({ getRequest: () => ({ user }) }),
    } as unknown as ExecutionContext)

  const guard = (flag: boolean, unlocked: boolean) => {
    const stepUpService = {
      appliesTo: (user: User) => config.clients.includes(user.client),
      useUnlock: jest.fn().mockResolvedValue(unlocked),
    }
    const featureFlagService = {
      getValue: jest.fn().mockResolvedValue(flag),
    }
    return new StepUpGuard(
      new Reflector(),
      featureFlagService as unknown as FeatureFlagService,
      stepUpService as unknown as StepUpService,
    )
  }

  it('asks the app to unlock when the area is locked', async () => {
    const error = await guard(true, false)
      .canActivate(context(appUser()))
      .catch((e) => e)

    expect(error).toBeInstanceOf(GraphQLError)
    expect(error.extensions.code).toBe(StepUpErrorCode.Required)
  })

  it('serves an unlocked session', async () => {
    await expect(
      guard(true, true).canActivate(context(appUser())),
    ).resolves.toBe(true)
  })

  it('does nothing while the switch is off', async () => {
    await expect(
      guard(false, false).canActivate(context(appUser())),
    ).resolves.toBe(true)
  })

  it('leaves other clients alone', async () => {
    await expect(
      guard(true, false).canActivate(
        context(appUser({ client: '@island.is/web' })),
      ),
    ).resolves.toBe(true)
  })

  it('never passes for want of a user', async () => {
    await expect(guard(true, true).canActivate(context())).rejects.toThrow()
  })
})
