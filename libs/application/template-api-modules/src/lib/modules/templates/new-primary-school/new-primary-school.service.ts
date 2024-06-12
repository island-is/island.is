import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { FriggClientService } from '@island.is/clients/directorate-of-education-and-school-services/frigg'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../types'

@Injectable()
export class NewPrimarySchoolService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly friggClientService: FriggClientService,
  ) {
    super(ApplicationTypes.NEW_PRIMARY_SCHOOL)
  }

  async getTypesX({ auth }: TemplateApiModuleActionProps) {
    console.log('TEMPLATE API-----getTypesX')
    return await this.friggClientService.getAllKeyOptions(auth)
  }
}
