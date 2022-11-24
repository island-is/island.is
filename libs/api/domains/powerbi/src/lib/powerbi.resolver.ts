import { Configuration, ConfidentialClientApplication } from '@azure/msal-node'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { PowerBiEmbedTokenInput } from './dto/powerbiEmbedToken.input'
import { PowerBiEmbedTokenResponse } from './models/powerbiEmbedTokenResponse'

type Owner = 'Fiskistofa'

@Resolver()
export class PowerBiResolver {
  private async getAccessToken(owner: Owner) {
    let clientId = ''
    let clientSecret = ''
    let tenantId = ''

    switch (owner) {
      case 'Fiskistofa':
        {
          clientId = process.env.FISKISTOFA_POWERBI_CLIENT_ID as string
          clientSecret = process.env.FISKISTOFA_POWERBI_CLIENT_SECRET as string
          tenantId = process.env.FISKISTOFA_POWERBI_TENANT_ID as string
        }
        break
      default: {
        // TODO: Log that the owner didn't match anyone
        return null
      }
    }

    const msalConfig: Configuration = {
      auth: {
        clientId,
        clientSecret,
        authority: `https://login.microsoftonline.com/${tenantId}`,
      },
    }

    const clientApplication = new ConfidentialClientApplication(msalConfig)

    try {
      const tokenResponse = await clientApplication.acquireTokenByClientCredential(
        {
          scopes: ['https://analysis.windows.net/powerbi/api/.default'],
        },
      )
      return tokenResponse?.accessToken
    } catch (err) {
      // TODO: log the error
      return null
    }
  }

  private async getEmbedToken(
    reportId: string,
    datasetIds: string[],
    targetWorkspaceId: string,
    accessToken: string,
  ) {
    // Add report id in the request
    const formData = {
      reports: [
        {
          id: reportId,
        },
      ],
      datasets: [] as { id: string }[],
      targetWorkspaces: [{ id: targetWorkspaceId }],
    }

    // Add dataset ids in the request
    for (const datasetId of datasetIds) {
      formData.datasets.push({
        id: datasetId,
      })
    }

    const embedTokenApiUrl = 'https://api.powerbi.com/v1.0/myorg/GenerateToken'

    // Generate Embed token for single report, workspace, and multiple datasets. Refer https://aka.ms/MultiResourceEmbedToken
    const response = await fetch(embedTokenApiUrl, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      // TODO: log that the embed token could not be fetched
      return null
    }
    const data = await response.json()

    return data.token
  }

  @Query(() => PowerBiEmbedTokenResponse)
  async powerbiEmbedToken(@Args('input') input: PowerBiEmbedTokenInput) {
    const accessToken = await this.getAccessToken(input.owner)

    if (!accessToken) {
      return {
        token: null,
        embedUrl: null,
      }
    }

    const url = `https://api.powerbi.com/v1.0/myorg/groups/${input.workspaceId}/reports/${input.reportId}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      return { token: null, embedUrl: null }
    }

    const result = await response.json()

    const embedToken = await this.getEmbedToken(
      input.reportId,
      [result.datasetId],
      input.workspaceId,
      accessToken,
    )

    return {
      token: embedToken,
      embedUrl: result.embedUrl,
    }
  }
}
