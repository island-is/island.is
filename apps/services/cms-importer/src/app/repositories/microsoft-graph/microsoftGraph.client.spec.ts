import { MicrosoftGraphClient } from './microsoftGraph.client'

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

const tokenResponse = () =>
  jsonResponse({ access_token: 'token', expires_in: 3600 })

const credentials = {
  tenantId: 'tenant',
  clientId: 'client',
  clientSecret: 'secret',
}

describe('MicrosoftGraphClient', () => {
  it('gets a token once and follows paging links', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValueOnce(tokenResponse())
      .mockResolvedValueOnce(
        jsonResponse({
          value: [{ id: '1' }],
          '@odata.nextLink': 'https://graph.microsoft.com/v1.0/next-page',
        }),
      )
      .mockResolvedValueOnce(jsonResponse({ value: [{ id: '2' }] }))
    const client = new MicrosoftGraphClient(credentials, fetchFn)

    const users = await client.getGroupUsers('group')

    expect(users).toEqual([{ id: '1' }, { id: '2' }])
    expect(fetchFn).toHaveBeenCalledTimes(3)
    expect(fetchFn.mock.calls[0][0]).toBe(
      'https://login.microsoftonline.com/tenant/oauth2/v2.0/token',
    )
    expect(fetchFn.mock.calls[1][0]).toContain(
      '/groups/group/transitiveMembers/microsoft.graph.user?$select=',
    )
    expect(fetchFn.mock.calls[2][0]).toBe(
      'https://graph.microsoft.com/v1.0/next-page',
    )
    expect(fetchFn.mock.calls[2][1].headers.Authorization).toBe('Bearer token')
  })

  it('returns null when a user has no photo', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValueOnce(tokenResponse())
      .mockResolvedValueOnce(new Response(null, { status: 404 }))
    const client = new MicrosoftGraphClient(credentials, fetchFn)

    await expect(client.getUserPhoto('user')).resolves.toBeNull()
  })

  it('throws when the token request fails', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
    const client = new MicrosoftGraphClient(credentials, fetchFn)

    await expect(client.getGroupUsers('group')).rejects.toThrow(
      'Entra ID token request failed with status 401',
    )
  })
})
