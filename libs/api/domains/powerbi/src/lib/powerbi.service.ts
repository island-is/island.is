import { Configuration, ConfidentialClientApplication } from '@azure/msal-node'
import { ConfigType } from '@island.is/nest/config'
import { PowerBiConfig } from './powerbi.config'

type Owner = 'Fiskistofa'
const BASE_URL = 'https://api.powerbi.com/v1.0/myorg'

export class PowerBiService {
  constructor(private config: ConfigType<typeof PowerBiConfig>) {}

  async getAccessToken(owner: Owner) {
    let clientId = ''
    let clientSecret = ''
    let tenantId = ''

    switch (owner) {
      case 'Fiskistofa':
        {
          clientId = this.config.fiskistofaPowerBiClientId
          clientSecret = this.config.fiskistofaPowerBiClientSecret
          tenantId = this.config.fiskistofaPowerBiTenantId
        }
        break
    }

    const msalConfig: Configuration = {
      auth: {
        clientId,
        clientSecret,
        authority: `https://login.microsoftonline.com/${tenantId}`,
      },
    }

    const clientApplication = new ConfidentialClientApplication(msalConfig)

    const tokenResponse = await clientApplication.acquireTokenByClientCredential(
      {
        scopes: ['https://analysis.windows.net/powerbi/api/.default'],
      },
    )
    return tokenResponse?.accessToken as string
  }

  async getReport(workspaceId: string, reportId: string, accessToken: string) {
    const url = `${BASE_URL}/groups/${workspaceId}/reports/${reportId}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return response.json()
  }

  async getEmbedToken(
    reportId: string,
    datasetIds: string[],
    targetWorkspaceId: string,
    accessToken: string,
  ) {
    const formData = {
      reports: [
        {
          id: reportId,
        },
      ],
      datasets: datasetIds.map((datasetId) => ({ id: datasetId })),
      targetWorkspaces: [{ id: targetWorkspaceId }],
    }

    const embedTokenApiUrl = `${BASE_URL}/GenerateToken`

    // Generate Embed token for single report, workspace, and multiple datasets. Refer to: https://aka.ms/MultiResourceEmbedToken
    const response = await fetch(embedTokenApiUrl, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()
    return data?.token
  }
}
