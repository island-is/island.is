import fetchMock from 'fetch-mock'
import * as cookies from '../utils/cookies'
import { api } from './'
import * as _Window from 'jsdom/lib/jsdom/browser/Window'

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

      // Act
      api.logOut()

      // Assert
      expect(cookies.getCookie('judicial-system.csrf')).toEqual(undefined)
    })
  })
})
