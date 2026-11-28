import { BadRequestException, ForbiddenException } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  SessionCannotStepUpError,
  type CibaClient,
  type StepUpClaims,
} from '@island.is/auth/step-up'
import type { IdentityClientService } from '@island.is/clients/identity'
import type { FeatureFlagService } from '@island.is/nest/feature-flags'

import {
  createBindingMessage,
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
  exemptClients: ['@island.is/app'],
  maxAgeInSeconds: 600,
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
  const identity = {
    getIdentity: jest.fn().mockResolvedValue({ name: 'Jón Jónsson' }),
  }
  const service = new MedicineDelegationStepUpService(
    { ...config, ...configOverrides },
    ciba as unknown as CibaClient,
    flags as unknown as FeatureFlagService,
    identity as unknown as IdentityClientService,
  )
  return { service, ciba, flags, identity }
}

describe('MedicineDelegationStepUpService', () => {
  describe('isRequired', () => {
    it('is required from the web client when the flag is on', async () => {
      const { service } = setup()
      expect(await service.isRequired(user)).toBe(true)
    })

    it('is required from a client nobody listed', async () => {
      const { service } = setup()
      const other = { ...user, client: '@island.is/some-new-client' } as User

      expect(await service.isRequired(other)).toBe(true)
    })

    it('asks the flag about the person at the keyboard, and defaults to off', async () => {
      const { service, flags } = setup()
      const acting = {
        ...user,
        actor: { nationalId: '0101304929', scope: [] },
      } as User

      await service.isRequired(acting)

      expect(flags.getValue).toHaveBeenCalledWith(
        'isHealthMedicineDelegationStepUpEnabled',
        false,
        expect.objectContaining({ nationalId: '0101304929' }),
      )
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
        bindingMessage: 'Lyfjaheimild: Jón Jónsson',
        contextHash: hashGrant(user, input),
      })
    })

    it('looks the recipient up in the registry', async () => {
      const { service, ciba, identity } = setup()
      ciba.start.mockResolvedValue({ authReqId: 'req' })

      await service.start(user, input)

      expect(identity.getIdentity).toHaveBeenCalledWith(input.nationalId)
    })

    it('refuses a recipient the registry does not know', async () => {
      const { service, ciba, identity } = setup()
      identity.getIdentity.mockResolvedValue(null)

      await expect(service.start(user, input)).rejects.toThrow(
        BadRequestException,
      )
      expect(ciba.start).not.toHaveBeenCalled()
    })

    it('refuses a card session without asking the identity server', async () => {
      const { service, ciba } = setup()
      const cardUser = { ...user, idp: 'audkenni_card' } as User

      await expect(service.start(cardUser, input)).rejects.toThrow(
        SessionCannotStepUpError,
      )
      expect(ciba.start).not.toHaveBeenCalled()
    })
  })

  describe('check', () => {
    it.each(['pending', 'denied', 'expired'] as const)(
      'passes on %s',
      async (status) => {
        const { service, ciba } = setup()
        ciba.poll.mockResolvedValue({ status })

        expect(await service.check(user, 'req', input)).toEqual({ status })
      },
    )

    it('confirms an authentication made by this person for this grant', async () => {
      const { service, ciba } = setup()
      ciba.poll.mockResolvedValue({
        status: 'authenticated',
        claims: claimsFor(),
      })

      expect(await service.check(user, 'req', input)).toMatchObject({
        status: 'confirmed',
        claims: { nationalId: user.nationalId },
      })
      expect(ciba.poll).toHaveBeenCalledWith('req')
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

      await expect(service.check(user, 'req', input)).rejects.toThrow(
        ForbiddenException,
      )
    })

    it('refuses when the grant was changed after the authentication started', async () => {
      const { service, ciba } = setup()
      ciba.poll.mockResolvedValue({
        status: 'authenticated',
        claims: claimsFor(),
      })

      await expect(
        service.check(user, 'req', { ...input, nationalId: '0101303019' }),
      ).rejects.toThrow(ForbiddenException)
    })

    it('accepts a fake login only where configured', async () => {
      const { service, ciba } = setup({
        configOverrides: { allowFakeLogin: true },
      })
      ciba.poll.mockResolvedValue({
        status: 'authenticated',
        claims: claimsFor({ acr: '0' }),
      })

      expect((await service.check(user, 'req', input)).status).toBe('confirmed')
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

      expect((await service.check(acting, 'req', input)).status).toBe(
        'confirmed',
      )
    })
  })

  describe('createBindingMessage', () => {
    it('shortens a long name to at most 100 characters', () => {
      expect(createBindingMessage('A'.repeat(300)).length).toBeLessThanOrEqual(
        100,
      )
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
