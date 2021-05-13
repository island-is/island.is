import { mergeAuthSettings } from './AuthSettings'

describe('mergeAuthSettings', () => {
  it('provides good defaults', () => {
    // act
    const settings = mergeAuthSettings({
      client_id: 'test-client',
    })

    // assert
    expect(settings).toMatchInlineSnapshot(`
      Object {
        "authority": "https://innskra.island.is",
        "baseUrl": "http://localhost",
        "client_id": "test-client",
        "loadUserInfo": true,
        "monitorSession": false,
        "post_logout_redirect_uri": "http://localhost",
        "redirectPath": "/auth/callback",
        "redirectPathSilent": "/auth/callback-silent",
        "redirect_uri": "http://localhost/auth/callback",
        "response_type": "code",
        "revokeAccessTokenOnSignout": true,
        "silent_redirect_uri": "http://localhost/auth/callback-silent",
        "userStore": t {
          "_prefix": "oidc.",
          "_store": Storage {},
        },
      }
    `)
  })

  it('creates uris from baseUrl and redirect paths', () => {
    // act
    const settings = mergeAuthSettings({
      client_id: 'test-client',
      baseUrl: 'https://island.is',
      redirectPath: '/auth',
      redirectPathSilent: '/auth-silent',
    })

    // assert
    expect(settings).toMatchObject({
      baseUrl: 'https://island.is',
      post_logout_redirect_uri: 'https://island.is',
      redirectPath: '/auth',
      redirectPathSilent: '/auth-silent',
      redirect_uri: 'https://island.is/auth',
      silent_redirect_uri: 'https://island.is/auth-silent',
    })
  })
})
