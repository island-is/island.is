import { Configuration, ConfidentialClientApplication } from '@azure/msal-node'
import { Inject, Injectable } from '@nestjs/common'
import { LazyDuringDevScope } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { PowerBiConfig } from './powerbi.config'
import { GetPowerBiEmbedPropsFromServerResponse } from './dto/getPowerBiEmbedPropsFromServer.response'

type Owner = 'Fiskistofa'
const BASE_URL = 'https://api.powerbi.com/v1.0/myorg'

@Injectable({ scope: LazyDuringDevScope })
export class PowerBiService {
  private fetch: EnhancedFetchAPI

  constructor(
    @Inject(PowerBiConfig.KEY)
    private config: ConfigType<typeof PowerBiConfig>,
  ) {
    this.fetch = createEnhancedFetch({ name: 'PowerBiService' })
  }

  async getEmbedProps(powerBiSlice: {
    owner?: string
    workspaceId?: string
    reportId?: string
  }): Promise<GetPowerBiEmbedPropsFromServerResponse | null> {
    if (
      !powerBiSlice.owner ||
      !powerBiSlice.workspaceId ||
      !powerBiSlice.reportId
    )
      return null

    const accessToken = await this.getAccessToken(powerBiSlice.owner as Owner)

    const report = await this.getReport(
      powerBiSlice.workspaceId,
      powerBiSlice.reportId,
      accessToken,
    )

    const embedToken = await this.getEmbedToken(
      powerBiSlice.reportId,
      [report.datasetId],
      powerBiSlice.workspaceId,
      accessToken,
    )

    return {
      accessToken: embedToken,
      embedUrl: report.embedUrl,
    }
  }

  private async getAccessToken(owner: Owner) {
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

    const tokenResponse =
      await clientApplication.acquireTokenByClientCredential({
        scopes: ['https://analysis.windows.net/powerbi/api/.default'],
      })
    return tokenResponse?.accessToken as string
  }

  private async getReport(
    workspaceId: string,
    reportId: string,
    accessToken: string,
  ) {
    const url = `${BASE_URL}/groups/${workspaceId}/reports/${reportId}`

    const response = await this.fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return response.json()
  }

  private async getEmbedToken(
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
    const response = await this.fetch(embedTokenApiUrl, {
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
