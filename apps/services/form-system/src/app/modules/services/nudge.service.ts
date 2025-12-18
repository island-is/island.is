import { Injectable } from '@nestjs/common'
import { ApplicationDto } from '../applications/models/dto/application.dto'
import { InjectModel } from '@nestjs/sequelize'
import { ApplicationEvent } from '../applications/models/applicationEvent.model'

@Injectable()
export class NudgeService {
  constructor(
    @InjectModel(ApplicationEvent)
    private readonly applicationEventModel: typeof ApplicationEvent,
  ) {}
  async sendNudge(
    applicationDto: ApplicationDto,
    url: string,
  ): Promise<boolean> {
    let success = true
    try {
      const response = await fetch(url, {
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
