import { Args, Query, Resolver } from '@nestjs/graphql'
import { PowerBiEmbedTokenInput } from './dto/powerbiEmbedToken.input'
import { PowerBiEmbedTokenResponse } from './models/powerbiEmbedTokenResponse'
import { PowerBiService } from './powerbi.service'

@Resolver()
export class PowerBiResolver {
  constructor(private readonly powerBiService: PowerBiService) {}

  @Query(() => PowerBiEmbedTokenResponse)
  async powerbiEmbedToken(@Args('input') input: PowerBiEmbedTokenInput) {
    const accessToken = await this.powerBiService.getAccessToken(input.owner)

    const report = await this.powerBiService.getReport(
      input.workspaceId,
      input.reportId,
      accessToken,
    )

    const embedToken = await this.powerBiService.getEmbedToken(
      input.reportId,
      [report.datasetId],
      input.workspaceId,
      accessToken,
    )

    return {
      token: embedToken,
      embedUrl: report.embedUrl,
    }
  }
}
