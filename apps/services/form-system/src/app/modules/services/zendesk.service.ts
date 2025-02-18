import { Injectable } from '@nestjs/common'
import { OrganizationUrl } from '../organizationUrls/models/organizationUrl.model'
import { ApplicationDto } from '@island.is/form-system-dto'

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
