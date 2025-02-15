import { ApplicationDto } from '../../applications/models/dto/application.dto'
import { ApplicationServeDto } from './applicationServe.dto'

export class ApplicationServeMapper {
  mapApplicationToApplicationServeDto(
    applicationDto: ApplicationDto,
  ): ApplicationServeDto {
    const applicationServeDto: ApplicationServeDto = {
      applicationId: applicationDto.id,
      formId: applicationDto.formId,
      slug: applicationDto.slug,
      values: [],
    }

    return applicationServeDto
  }
}
