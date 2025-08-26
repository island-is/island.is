import { Injectable } from '@nestjs/common'
// import { ApplicationDto } from '../applications/models/dto/application.dto'
// import { OrganizationUrl } from '../organizationUrls/models/organizationUrl.model'
// import { createEnhancedFetch } from '@island.is/clients/middlewares'

@Injectable()
export class ZendeskService {
  // async sendToZendesk(
  //   applicationDto: ApplicationDto,
  //   url: OrganizationUrl,
  // ): Promise<boolean> {
  //   const prodTenantId = 'zendesk-prod'
  //   const devTenantId = 'zendesk-dev'
  //   const prodApiKey = 'prod-api-key'
  //   const devApiKey = 'dev-api-key'
  //   const username = 'username'
  //   const tenantId = url.isTest === true ? devTenantId : prodTenantId
  //   const apiKey = url.isTest === true ? devApiKey : prodApiKey
  //   const zendeskUrl = `https://${tenantId}.zendesk.com/api/v2/tickets.json`
  //   const credentials = Buffer.from(`${username}:${apiKey}`).toString('base64')
  //   const enhancedFetch = createEnhancedFetch({
  //     name: 'form-system-zendesk',
  //     organizationSlug: 'stafraent-island',
  //     timeout: 20000,
  //     logErrorResponseBody: true,
  //   })
  //   try {
  //     const response = await enhancedFetch(
  //       `https://translation.googleapis.com/language/translate/v2`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'X-goog-api-key': apiKey,
  //         },
  //         body: JSON.stringify({
  //           q: input.q,
  //           source: 'is',
  //           target: 'en',
  //           format: 'text',
  //         }),
  //       },
  //     )
  //     if (!response.ok) {
  //       throw new Error(
  //         `Failed to fetch Google translation with status: ${response.status}`,
  //       )
  //     }
  //     const result = await response.json()
  //     return {
  //       translation: result?.data?.translations?.[0]?.translatedText || '',
  //     } as GoogleTranslation
  //   } catch (error) {
  //     handle4xx(error, this.handleError, 'failed to get Google translation')
  //     throw new Error('Unexpected error in translation service')
  //   }
  //   console.log(`${applicationDto.id}: ${url.url}`)
  //   return true
  // }
}
