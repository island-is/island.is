import { BadRequestException, UnauthorizedException } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { ApplicationTypes } from '@island.is/application/types'
import type { EnhancedFetchAPI } from '@island.is/clients/middlewares'

import { ApplicationTranslationClient } from './application-translation.client'

describe('ApplicationTranslationClient', () => {
  const user: User = {
    nationalId: '0101302989',
    scope: [],
    authorization: 'Bearer token',
    client: 'test',
  }

  const jsonResponse = (body: unknown = {}) => ({
    json: async () => body,
  })

  let fetchMock: jest.MockedFunction<EnhancedFetchAPI>
  let client: ApplicationTranslationClient

  beforeEach(() => {
    fetchMock = jest.fn().mockResolvedValue(jsonResponse())
    client = new ApplicationTranslationClient(
      { baseApiUrl: 'http://localhost:3333', isConfigured: true },
      fetchMock,
    )
  })

  describe('introspectTemplate', () => {
    it('requests the encoded template path for a known typeId', async () => {
      await client.introspectTemplate(user, ApplicationTypes.PASSPORT)

      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:3333/admin/translations/templates/Passport/introspect',
        expect.objectContaining({ auth: user }),
      )
    })

    it('rejects an unknown typeId without calling the translation API', async () => {
      await expect(
        client.introspectTemplate(user, 'NotARealType'),
      ).rejects.toBeInstanceOf(BadRequestException)
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('rejects a path-traversal typeId without calling the translation API', async () => {
      await expect(
        client.introspectTemplate(
          user,
          '../../../public/translations/dl%2Eapplication?',
        ),
      ).rejects.toBeInstanceOf(BadRequestException)
      expect(fetchMock).not.toHaveBeenCalled()
    })
  })

  describe('loadRoleForm', () => {
    it('requests the encoded template form path for a known typeId', async () => {
      await client.loadRoleForm(
        user,
        ApplicationTypes.PASSPORT,
        'draft',
        'applicant',
      )

      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:3333/admin/translations/templates/Passport/form?stateKey=draft&roleId=applicant',
        expect.objectContaining({ auth: user }),
      )
    })

    it('rejects a path-traversal typeId without calling the translation API', async () => {
      await expect(
        client.loadRoleForm(
          user,
          '../../../public/translations/dl.application',
          'draft',
          'applicant',
        ),
      ).rejects.toBeInstanceOf(BadRequestException)
      expect(fetchMock).not.toHaveBeenCalled()
    })
  })

  describe('reviewTranslation', () => {
    it('encodes the translation id so path traversal cannot leave /admin/translations', async () => {
      await client.reviewTranslation(user, '../../../public/translations/foo')

      expect(fetchMock).toHaveBeenCalledTimes(1)
      const requestedUrl = fetchMock.mock.calls[0][0] as string
      expect(requestedUrl).toBe(
        'http://localhost:3333/admin/translations/..%2F..%2F..%2Fpublic%2Ftranslations%2Ffoo/review',
      )
      expect(new URL(requestedUrl).pathname).toBe(
        '/admin/translations/..%2F..%2F..%2Fpublic%2Ftranslations%2Ffoo/review',
      )
    })
  })

  describe('request auth', () => {
    it('does not fetch when the caller has no bearer token', async () => {
      const anonymous: User = { ...user, authorization: '' }

      await expect(
        client.introspectTemplate(anonymous, ApplicationTypes.PASSPORT),
      ).rejects.toBeInstanceOf(UnauthorizedException)
      expect(fetchMock).not.toHaveBeenCalled()
    })
  })
})
