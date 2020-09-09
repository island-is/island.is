import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common'
import { ApplicationService } from '../application.service'
import { Application } from '../application.model'

@Injectable()
export class ApplicationByIdPipe
  implements PipeTransform<string, Promise<Application>> {
  constructor(private readonly applicationService: ApplicationService) {}

  async transform(id: string): Promise<Application> {
    const existingApplication = await this.applicationService.findById(id)

    if (!existingApplication) {
      throw new NotFoundException(
        `An application with the id ${id} does not exist`,
      )
    }
    return existingApplication
  }
}
