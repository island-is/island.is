import fetchMock from 'fetch-mock'

describe('Judicial system web api endpoints', () => {
  describe('/api/auth/logout', () => {
    beforeAll(() => {
      fetchMock.mock('/api/auth/logout', 200, { response: { logout: true } })
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

      // Act
      await fetch('/api/auth/logout')

      // Assert
      expect(window.location.assign).toBeCalledWith('/')
    })
  })
})
