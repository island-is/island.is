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
})
