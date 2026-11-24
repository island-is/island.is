import type { User } from '@island.is/auth-nest-tools'
import { FetchError } from '@island.is/clients/middlewares'
import type { FriggKeyInfoClientService } from '@island.is/clients/mms/frigg'
import type { Logger } from '@island.is/logging'
import { ProblemError } from '@island.is/nest/problem'

import { EducationOwnContactResolver } from './educationOwnContact.resolver'

const fetchError = (status: number, body?: unknown): FetchError =>
  Object.assign(Object.create(FetchError.prototype), {
    name: 'FetchError',
    message: `Request failed with status code ${status}`,
    status,
    statusText: '',
    url: 'https://frigg.test/me/contact',
    body,
    headers: new Headers(),
  }) as FetchError

const mmsError = (status: number, code: string) =>
  fetchError(status, {
    statusCode: status,
    code,
    message: 'Villa',
    requestId: 'req-1',
  })

const user = {} as User

const setup = () => {
  const keyInfoClient = {
    getOwnContact: jest.fn(),
    updateOwnContact: jest.fn(),
  }
  const logger = { info: jest.fn() }
  const resolver = new EducationOwnContactResolver(
    (keyInfoClient as unknown) as FriggKeyInfoClientService,
    (logger as unknown) as Logger,
  )
  return { resolver, keyInfoClient, logger }
}

describe('EducationOwnContactResolver', () => {
  describe('educationOwnContact', () => {
    it('returns the contact as MMS gives it, empty values included', async () => {
      const { resolver, keyInfoClient } = setup()
      keyInfoClient.getOwnContact.mockResolvedValue({ email: null, phone: null })

      await expect(resolver.educationOwnContact(user)).resolves.toEqual({
        email: null,
        phone: null,
      })
    })

    it('returns null on 404 and logs only the status', async () => {
      const { resolver, keyInfoClient, logger } = setup()
      keyInfoClient.getOwnContact.mockRejectedValue(fetchError(404))

      await expect(resolver.educationOwnContact(user)).resolves.toBeNull()
      expect(logger.info).toHaveBeenCalledWith(expect.any(String), {
        status: 404,
      })
    })

    it.each(['NOT_A_GUARDIAN', 'DELEGATION_NOT_SUPPORTED'])(
      'returns null on 403 %s and logs the code',
      async (code) => {
        const { resolver, keyInfoClient, logger } = setup()
        keyInfoClient.getOwnContact.mockRejectedValue(mmsError(403, code))

        await expect(resolver.educationOwnContact(user)).resolves.toBeNull()
        expect(logger.info).toHaveBeenCalledWith(expect.any(String), {
          status: 403,
          mmsCode: code,
        })
      },
    )

    it('throws a problem for any other MMS code', async () => {
      const { resolver, keyInfoClient, logger } = setup()
      keyInfoClient.getOwnContact.mockRejectedValue(
        mmsError(403, 'INSUFFICIENT_SCOPE'),
      )

      await expect(resolver.educationOwnContact(user)).rejects.toBeInstanceOf(
        ProblemError,
      )
      expect(logger.info).not.toHaveBeenCalled()
    })

    it('passes on errors that are not from MMS', async () => {
      const { resolver, keyInfoClient } = setup()
      const error = new Error('boom')
      keyInfoClient.getOwnContact.mockRejectedValue(error)

      await expect(resolver.educationOwnContact(user)).rejects.toBe(error)
    })
  })

  describe('educationUpdateOwnContact', () => {
    it('sends both fields, with a missing one as null', async () => {
      const { resolver, keyInfoClient } = setup()
      keyInfoClient.updateOwnContact.mockResolvedValue({
        email: 'a@b.is',
        phone: null,
      })

      await resolver.educationUpdateOwnContact(user, { email: 'a@b.is' })

      expect(keyInfoClient.updateOwnContact).toHaveBeenCalledWith(user, {
        email: 'a@b.is',
        phone: null,
      })
    })

    it('passes on the field a validation error names', async () => {
      const { resolver, keyInfoClient } = setup()
      keyInfoClient.updateOwnContact.mockRejectedValue(
        fetchError(400, {
          statusCode: 400,
          code: 'VALIDATION',
          message: 'Validation failed',
          requestId: 'req-2',
          errors: ['phone must be E.164'],
        }),
      )

      const error = await resolver
        .educationUpdateOwnContact(user, { phone: '123' })
        .catch((e) => e)

      expect(error).toBeInstanceOf(ProblemError)
      expect(
        ((error as ProblemError).problem as unknown) as Record<string, unknown>,
      ).toMatchObject({ mmsCode: 'VALIDATION', mmsFields: ['phone'] })
    })
  })
})
