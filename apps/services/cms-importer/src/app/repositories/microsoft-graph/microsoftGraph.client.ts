import { GraphPhoto, GraphUser } from '../../ad-staff-import/types'

const LOGIN_URL = 'https://login.microsoftonline.com'
const GRAPH_URL = 'https://graph.microsoft.com/v1.0'
const USER_FIELDS = [
  'id',
  'displayName',
  'jobTitle',
  'department',
  'mail',
  'businessPhones',
  'accountEnabled',
]

export interface MicrosoftGraphCredentials {
  tenantId: string
  clientId: string
  clientSecret: string
}

/**
 * Read-only Microsoft Graph client using the client credentials flow.
 * Needs the application permissions User.Read.All and GroupMember.Read.All.
 */
export class MicrosoftGraphClient {
  private token?: { value: string; expiresAt: number }

  constructor(
    private readonly credentials: MicrosoftGraphCredentials,
    private readonly fetchFn: typeof fetch = fetch,
  ) {}

  /** Direct and nested members of the group that are users */
  async getGroupUsers(groupId: string): Promise<Array<GraphUser>> {
    const users: Array<GraphUser> = []
    let url: string | undefined = `${GRAPH_URL}/groups/${encodeURIComponent(
      groupId,
    )}/transitiveMembers/microsoft.graph.user?$select=${USER_FIELDS.join(
      ',',
    )}&$top=999`

    while (url) {
      const response = await this.get(url)
      if (!response.ok) {
        throw new Error(
          `Microsoft Graph group members request failed with status ${response.status}`,
        )
      }
      const page = (await response.json()) as {
        value: Array<GraphUser>
        '@odata.nextLink'?: string
      }
      users.push(...page.value)
      url = page['@odata.nextLink']
    }

    return users
  }

  /** Returns null when the user has no photo */
  async getUserPhoto(userId: string): Promise<GraphPhoto | null> {
    const response = await this.get(
      `${GRAPH_URL}/users/${encodeURIComponent(userId)}/photo/$value`,
    )
    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
      throw new Error(
        `Microsoft Graph photo request failed with status ${response.status}`,
      )
    }
    return {
      data: await response.arrayBuffer(),
      contentType: response.headers.get('content-type') ?? 'image/jpeg',
    }
  }

  private async get(url: string) {
    return this.fetchFn(url, {
      headers: { Authorization: `Bearer ${await this.getAccessToken()}` },
    })
  }

  private async getAccessToken(): Promise<string> {
    if (this.token && this.token.expiresAt > Date.now() + 60_000) {
      return this.token.value
    }

    const { tenantId, clientId, clientSecret } = this.credentials
    const response = await this.fetchFn(
      `${LOGIN_URL}/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          scope: 'https://graph.microsoft.com/.default',
          grant_type: 'client_credentials',
        }),
      },
    )
    if (!response.ok) {
      throw new Error(
        `Entra ID token request failed with status ${response.status}`,
      )
    }

    const json = (await response.json()) as {
      access_token: string
      expires_in: number
    }
    this.token = {
      value: json.access_token,
      expiresAt: Date.now() + json.expires_in * 1000,
    }
    return json.access_token
  }
}
