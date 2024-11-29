import { Injectable } from '@nestjs/common'
import { ApplicationDto } from '../applications/models/dto/application.dto'
import { OrganizationUrl } from '../organizationUrls/models/organizationUrl.model'

@Injectable()
export class ZendeskService {
  async sendToZendesk(
    applicationDto: ApplicationDto,
    url: OrganizationUrl,
  ): Promise<boolean> {
    console.log(`${applicationDto.id}: ${url.url}`)
    return true
  }
}
