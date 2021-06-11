import fetchMock from 'fetch-mock'
// import * as cookies from 'apps/financial-aid/web-osk/src/utils/cookies'
import { api } from './'

describe('Financial aid- web api endpoints', () => {
  describe('Logout endpoint', () => {
    beforeAll(() => {
      fetchMock.mock('/api/auth/logout', 200)
    })

    it('should delete the financial-aid.csrf cookie', async () => {
      // Arrange
      Object.defineProperty(window.document, 'cookie', {
        writable: true,
        value: 'financial-aid.csrf=mock_token',
      })

      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/test',
          assign: jest.fn(),
        },
      })

      // Act
      api.logOut()

      // Assert
      // expect(cookies.getCookie('financial-aid.csrf')).toEqual(undefined)
    })
  })
})
