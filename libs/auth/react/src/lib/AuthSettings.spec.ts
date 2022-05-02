import { mergeAuthSettings } from './AuthSettings'

describe('mergeAuthSettings', () => {
  it('provides good defaults', () => {
    // act
    const settings = mergeAuthSettings({
      client_id: 'test-client',
      authority: 'https://innskra.island.is',
    })

    // assert
    expect(settings).toMatchInlineSnapshot(`
      Object {
        "authority": "https://innskra.island.is",
        "baseUrl": "http://localhost",
        "checkSessionPath": "/connect/sessioninfo",
        "client_id": "test-client",
        "loadUserInfo": true,
        "mergeClaims": true,
        "monitorSession": false,
        "post_logout_redirect_uri": "http://localhost",
        "redirectPath": "/auth/callback",
        "redirectPathSilent": "/auth/callback-silent",
        "response_type": "code",
        "revokeTokenTypes": Array [
          "access_token",
          "refresh_token",
        ],
        "revokeTokensOnSignout": true,
        "silent_redirect_uri": "http://localhost/auth/callback-silent",
        "userStore": WebStorageStateStore {
          "_logger": Logger {
            "_name": "WebStorageStateStore",
          },
          "_prefix": "oidc.",
          "_store": Storage {},
        },
      }
    `)
  })

  it('creates uris from baseUrl and redirect paths', () => {
    // act
    const settings = mergeAuthSettings({
      authority: 'https://innskra.island.is',
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
      silent_redirect_uri: 'https://island.is/auth-silent',
    })
  })
})
