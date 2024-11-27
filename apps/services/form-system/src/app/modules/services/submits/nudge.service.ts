import { Injectable } from '@nestjs/common'
import { ApplicationDto } from '../../applications/models/dto/application.dto'
import { OrganizationUrl } from '../../organizationUrls/models/organizationUrl.model'

@Injectable()
export class NudgeService {
  async sendNudge(
    applicationDto: ApplicationDto,
    url: OrganizationUrl,
  ): Promise<boolean> {
    let success = true
    try {
      const response = await fetch(url.url, {
        method: 'POST',
        body: JSON.stringify({ applicationId: applicationDto.id }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log(`Response Status: ${response.status}`)
      console.log(`Response Body:`, await response.text())

      if (!response.ok) {
        success = false
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
    } catch (error) {
      success = false
      console.log('error', error)
    }

    return success
  }
}
