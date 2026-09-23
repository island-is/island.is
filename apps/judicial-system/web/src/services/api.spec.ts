import fetchMock from 'fetch-mock'

import * as cookies from '@island.is/judicial-system-web/src/utils/cookies'

import { api } from './'

describe('Judicial system web api endpoints', () => {
  describe('Logout endpoint', () => {
    beforeAll(() => {
      fetchMock.mock('/api/auth/logout', 200)
    })

    it('should delete the judicial-system.csrf cookie', async () => {
      // Arrange
      Object.defineProperty(window.document, 'cookie', {
        writable: true,
        value: 'judicial-system.csrf=mock_token',
      })

      // location.assign is not stubbable under jsdom; this test only asserts
      // cookie deletion.

      // Act
      api.logout()

      // Assert
      expect(cookies.getCookie('judicial-system.csrf')).toEqual(undefined)
    })
  })

  describe('Feature endpoint', () => {
    afterEach(() => {
      fetchMock.reset()
    })

    it('should report a provided feature', async () => {
      fetchMock.mock('/api/feature/SOME_FEATURE', { body: true })

      await expect(api.getFeature('SOME_FEATURE')).resolves.toBe(true)
    })

    it('should report a hidden feature', async () => {
      // fetch-mock does not take a bare `false` as a body, so send the JSON text.
      fetchMock.mock('/api/feature/SOME_FEATURE', {
        body: 'false',
        headers: { 'content-type': 'application/json' },
      })

      await expect(api.getFeature('SOME_FEATURE')).resolves.toBe(false)
    })

    // A failing api answers with a JSON error body, which is truthy. That must
    // surface as a failure, not as the feature being provided.
    it('should reject a failed lookup even when its body is truthy', async () => {
      fetchMock.mock('/api/feature/SOME_FEATURE', {
        status: 503,
        body: { statusCode: 503, message: 'Service Unavailable' },
      })

      await expect(api.getFeature('SOME_FEATURE')).rejects.toThrow('status 503')
    })

    it('should reject an answer that is not a boolean', async () => {
      fetchMock.mock('/api/feature/SOME_FEATURE', { body: { provided: true } })

      await expect(api.getFeature('SOME_FEATURE')).rejects.toThrow(
        'non-boolean',
      )
    })
  })
})
