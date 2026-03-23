import { withAuthContext, getAuthContext } from './auth.context'
import { Auth } from './auth'

describe('AuthContext', () => {
  const mockAuth: Auth = {
    sub: 'test-subject',
    sid: 'test-session-id',
    nationalId: '1234567890',
    scope: ['test-scope'],
    authorization: 'Bearer test-token',
    client: 'test-client',
    delegationType: [],
    actor: {
      nationalId: '0987654321',
      scope: ['actor-scope'],
    },
    ip: '127.0.0.1',
    userAgent: 'test-user-agent',
    audkenniSimNumber: '1234567',
  }

  describe('withAuthContext', () => {
    it('should set auth context and execute callback, with arguments', () => {
      const callback = jest.fn().mockReturnValue('test-result')

      const result = withAuthContext(mockAuth, callback, 'arg1', 'arg2', 123)

      expect(callback).toHaveBeenCalled()
      expect(callback).toHaveBeenCalledWith('arg1', 'arg2', 123)
      expect(result).toBe('test-result')
    })

    it('should make auth context available within callback', () => {
      let capturedAuth: Auth | null = null

      withAuthContext(mockAuth, () => {
        capturedAuth = getAuthContext()
      })

      expect(capturedAuth).toEqual(mockAuth)
    })

    it('should make auth context available in nested async operations', async () => {
      let capturedAuth: Auth | null = null

      await withAuthContext(mockAuth, async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        capturedAuth = getAuthContext()
      })

      expect(capturedAuth).toEqual(mockAuth)
    })

    it('should handle async callback that returns a promise', async () => {
      const asyncCallback = jest.fn().mockResolvedValue('async-result')

      const result = await withAuthContext(mockAuth, asyncCallback)

      expect(asyncCallback).toHaveBeenCalled()
      expect(result).toBe('async-result')
    })

    it('should propagate auth context through multiple nested calls', () => {
      let auth1: Auth | null = null
      let auth2: Auth | null = null
      let auth3: Auth | null = null

      const nestedFunction1 = () => {
        auth1 = getAuthContext()
        nestedFunction2()
      }

      const nestedFunction2 = () => {
        auth2 = getAuthContext()
        nestedFunction3()
      }

      const nestedFunction3 = () => {
        auth3 = getAuthContext()
      }

      withAuthContext(mockAuth, nestedFunction1)

      expect(auth1).toEqual(mockAuth)
      expect(auth2).toEqual(mockAuth)
      expect(auth3).toEqual(mockAuth)
    })

    it('should handle callback that throws an error', () => {
      const errorCallback = jest.fn().mockImplementation(() => {
        throw new Error('Test error')
      })

      expect(() => {
        withAuthContext(mockAuth, errorCallback)
      }).toThrow('Test error')
    })
  })

  describe('getAuthContext', () => {
    it('should return null when no auth context is set', () => {
      const auth = getAuthContext()
      expect(auth).toBeNull()
    })

    it('should return the current auth context when set', () => {
      withAuthContext(mockAuth, () => {
        const auth = getAuthContext()
        expect(auth).toEqual(mockAuth)
      })
    })

    it('should return null after context is cleared', () => {
      withAuthContext(mockAuth, () => {
        // Context should be available here
        expect(getAuthContext()).toEqual(mockAuth)
      })

      // Context should be null outside the withAuthContext block
      expect(getAuthContext()).toBeNull()
    })

    it('should return different contexts for different withAuthContext calls', () => {
      const auth1: Auth = { ...mockAuth, sub: 'user1' }
      const auth2: Auth = { ...mockAuth, sub: 'user2' }

      let capturedAuth1: Auth | null = null
      let capturedAuth2: Auth | null = null

      withAuthContext(auth1, () => {
        capturedAuth1 = getAuthContext()
      })

      withAuthContext(auth2, () => {
        capturedAuth2 = getAuthContext()
      })

      expect(capturedAuth1).toEqual(auth1)
      expect(capturedAuth2).toEqual(auth2)
    })
  })

  describe('context isolation', () => {
    it('should isolate contexts between different withAuthContext calls', () => {
      const auth1: Auth = { ...mockAuth, sub: 'user1' }
      const auth2: Auth = { ...mockAuth, sub: 'user2' }

      let outerAuth: Auth | null = null
      let innerAuth: Auth | null = null

      withAuthContext(auth1, () => {
        outerAuth = getAuthContext()

        withAuthContext(auth2, () => {
          innerAuth = getAuthContext()
        })
      })

      expect(outerAuth).toEqual(auth1)
      expect(innerAuth).toEqual(auth2)
    })
  })
})
