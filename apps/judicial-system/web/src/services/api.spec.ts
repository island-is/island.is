import fetchMock from 'fetch-mock'
import * as cookies from '../utils/cookies'
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

      // Act
      api.logOut()

      // Assert
      expect(cookies.getCookie('judicial-system.csrf')).toEqual(undefined)
    })

    it('should redirect the user to the login screen', async () => {
      // Arrange
      window.location = {
        href: '',
        ancestorOrigins: [] as any,
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
      api.logOut()

      // Assert
      expect(spy).toHaveBeenCalledWith('/')
    })
  })
})
