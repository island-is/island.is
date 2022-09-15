import fetchMock from 'fetch-mock'
import { getCookie } from './api'
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

      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/test',
          assign: jest.fn(),
        },
      })

      // Act
      await api.logout()

      // Assert
      expect(getCookie('judicial-system.csrf')).toEqual(undefined)
    })
  })
})
