import fetchMock from 'fetch-mock'
import * as cookies from '../utils/cookies'
import * as api from './'

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
      await api.logOut()

      // Assert
      expect(cookies.getCookie('judicial-system.csrf')).toEqual(null)
    })

    it('should redirect the user to the login screen', async () => {
      // Arrange
      delete window.location
      window.location = {
        href: '',
        ancestorOrigins: null,
        hash: '',
        host: '',
        hostname: '',
        origin: '',
        pathname: '',
        port: '',
        protocol: '',
        search: '',
        assign: jest.fn(),
        reload: () => null,
        replace: () => null,
      }

      const spy = jest.spyOn(window.location, 'assign')

      // Act
      await api.logOut()

      // Assert
      expect(spy).toHaveBeenCalledWith('/')
    })
  })
})
