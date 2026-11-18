import type { User } from '@island.is/auth-nest-tools'
import type { CibaClient, StepUpClaims } from '@island.is/auth/step-up'
import type { FeatureFlagService } from '@island.is/nest/feature-flags'

import {
  hashGrant,
  MedicineDelegationStepUpService,
} from './medicine-delegation-step-up.service'

const config = {
  issuer: 'https://ids',
  clientId: '@island.is/clients/step-up',
  clientSecret: 'secret',
  scope: 'openid @island.is/auth/step-up',
  requiredAcr: 'eidas-loa-high',
  allowFakeLogin: false,
  requiredForClients: ['@island.is/web'],
  maxAgeInSeconds: 600,
  isConfigured: true,
}

const user = {
  nationalId: '0101302399',
  client: '@island.is/web',
  authorization: 'Bearer user-token',
  scope: [],
  idp: 'audkenni_sim',
  acr: 'eidas-loa-high',
} as unknown as User

const input = {
  nationalId: '0101307789',
  from: new Date('2026-11-18T00:00:00Z'),
  to: new Date('2027-11-18T00:00:00Z'),
  lookup: true,
}

const claimsFor = (overrides: Partial<StepUpClaims> = {}): StepUpClaims => ({
  sub: 'sub',
  nationalId: user.nationalId,
  acr: 'eidas-loa-high',
  amr: ['hwk', 'pin'],
  authTime: new Date(),
  contextHash: hashGrant(user, input),
  ...overrides,
})

const setup = ({
  flag = true,
  configOverrides = {},
}: { flag?: boolean; configOverrides?: Partial<typeof config> } = {}) => {
  const ciba = { start: jest.fn(), poll: jest.fn() }
  const flags = { getValue: jest.fn().mockResolvedValue(flag) }
  const service = new MedicineDelegationStepUpService(
    { ...config, ...configOverrides },
    ciba as unknown as CibaClient,
    flags as unknown as FeatureFlagService,
  )
  return { service, ciba, flags }
}

describe('MedicineDelegationStepUpService', () => {
  describe('isRequired', () => {
    it('is required from the web client when the flag is on', async () => {
      const { service } = setup()
      expect(await service.isRequired(user)).toBe(true)
    })

    it('is not required when the flag is off', async () => {
      const { service } = setup({ flag: false })
      expect(await service.isRequired(user)).toBe(false)
    })

    it('is not required from the native app, whatever the flag says', async () => {
      const { service, flags } = setup()
      const appUser = { ...user, client: '@island.is/app' } as User

      expect(await service.isRequired(appUser)).toBe(false)
      expect(flags.getValue).not.toHaveBeenCalled()
    })
  })

  describe('start', () => {
    it("starts with the person's own token and the hash of the grant", async () => {
      const { service, ciba } = setup()
      ciba.start.mockResolvedValue({ authReqId: 'req' })

      await service.start(user, input)

      expect(ciba.start).toHaveBeenCalledWith({
        userToken: 'Bearer user-token',
        bindingMessage: expect.any(String),
        contextHash: hashGrant(user, input),
      })
    })

    it('refuses a card session without asking the identity server', async () => {
      const { service, ciba } = setup()
      const cardUser = { ...user, idp: 'audkenni_card' } as User

      expect(() => service.start(cardUser, input)).toThrow()
      expect(ciba.start).not.toHaveBeenCalled()
    })
  })

  describe('check', () => {
    it.each(['pending', 'denied', 'expired'] as const)(
      'passes on %s',
      async (status) => {
        const { service, ciba } = setup()
        ciba.poll.mockResolvedValue({ status })

        expect(await service.check(user, 'req', input)).toBe(status)
      },
    )

    it('confirms an authentication made by this person for this grant', async () => {
      const { service, ciba } = setup()
      ciba.poll.mockResolvedValue({
        status: 'authenticated',
        claims: claimsFor(),
      })

      expect(await service.check(user, 'req', input)).toBe('confirmed')
    })

    it.each([
      ['another person', { nationalId: '0101303019' }],
      ['a lower acr', { acr: 'islandis-passkey' }],
      ['a fake login', { acr: '0' }],
      ['another grant', { contextHash: 'other' }],
      ['no grant', { contextHash: undefined }],
      ['an old authentication', { authTime: new Date(Date.now() - 3600e3) }],
    ])('refuses %s', async (_, overrides) => {
      const { service, ciba } = setup()
      ciba.poll.mockResolvedValue({
        status: 'authenticated',
        claims: claimsFor(overrides),
      })

      await expect(service.check(user, 'req', input)).rejects.toThrow()
    })

    it('refuses when the grant was changed after the authentication started', async () => {
      const { service, ciba } = setup()
      ciba.poll.mockResolvedValue({
        status: 'authenticated',
        claims: claimsFor(),
      })

      await expect(
        service.check(user, 'req', { ...input, nationalId: '0101303019' }),
      ).rejects.toThrow()
    })

    it('accepts a fake login only where configured', async () => {
      const { service, ciba } = setup({
        configOverrides: { allowFakeLogin: true },
      })
      ciba.poll.mockResolvedValue({
        status: 'authenticated',
        claims: claimsFor({ acr: '0' }),
      })

      expect(await service.check(user, 'req', input)).toBe('confirmed')
    })

    it('expects the actor when acting for someone else', async () => {
      const { service, ciba } = setup()
      const acting = {
        ...user,
        actor: { nationalId: '0101304929', scope: [] },
      } as User
      ciba.poll.mockResolvedValue({
        status: 'authenticated',
        claims: claimsFor({
          nationalId: '0101304929',
          contextHash: hashGrant(acting, input),
        }),
      })

      expect(await service.check(acting, 'req', input)).toBe('confirmed')
    })
  })

  describe('hashGrant', () => {
    it.each([
      ['recipient', { nationalId: '0101303019' }],
      ['start', { from: new Date('2026-12-01T00:00:00Z') }],
      ['end', { to: new Date('2028-01-01T00:00:00Z') }],
      ['lookup', { lookup: false }],
    ])('changes with the %s', (_, change) => {
      expect(hashGrant(user, { ...input, ...change })).not.toBe(
        hashGrant(user, input),
      )
    })

    it('changes with the person granting', () => {
      const other = { ...user, nationalId: '0101303019' } as User
      expect(hashGrant(other, input)).not.toBe(hashGrant(user, input))
    })
  })
})
