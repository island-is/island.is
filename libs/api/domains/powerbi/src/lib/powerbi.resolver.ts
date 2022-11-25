import { Configuration, ConfidentialClientApplication } from '@azure/msal-node'
import { Inject } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { PowerBiEmbedTokenInput } from './dto/powerbiEmbedToken.input'
import { PowerBiEmbedTokenResponse } from './models/powerbiEmbedTokenResponse'

type Owner = 'Fiskistofa'

@Resolver()
export class PowerBiResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

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
        this.logger.info(
          'User requested embed token without providing an owner',
        )
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
      this.logger.error('Error occurred when trying to fetch accessToken', err)
      return null
    }
  }

  private async getReport(
    workspaceId: string,
    reportId: string,
    accessToken: string,
  ) {
    const url = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (!response.ok) {
        this.logger.error('Report response was not 2xx')
        return null
      }
      const report = await response.json()
      return report
    } catch (err) {
      this.logger.error(`Error occurred when trying to fetch report`, {
        workspaceId,
        reportId,
        err,
      })
      return null
    }
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

    const embedTokenApiUrl = 'https://api.powerbi.com/v1.0/myorg/GenerateToken'

    try {
      // Generate Embed token for single report, workspace, and multiple datasets. Refer to: https://aka.ms/MultiResourceEmbedToken
      const response = await fetch(embedTokenApiUrl, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        this.logger.error('Embed token response was not 2xx')
        return null
      }
      const data = await response.json()
      return data?.token
    } catch (err) {
      this.logger.error('Error occurred while fetching embed token', err)
      return null
    }
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

    const report = await this.getReport(
      input.workspaceId,
      input.reportId,
      accessToken,
    )

    if (!report) {
      return {
        token: null,
        embedUrl: null,
      }
    }

    const embedToken = await this.getEmbedToken(
      input.reportId,
      [report?.datasetId],
      input.workspaceId,
      accessToken,
    )

    return {
      token: embedToken,
      embedUrl: report?.embedUrl,
    }
  }
}
