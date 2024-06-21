import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { FriggClientService } from '@island.is/clients/mms/frigg'
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

  async getTypes({ auth }: TemplateApiModuleActionProps) {
    return await this.friggClientService.getTypes(auth)
  }

  async getAllKeyOptions({ auth }: TemplateApiModuleActionProps) {
    return await this.friggClientService.getAllKeyOptions(auth, undefined)
  }

  async getHealth({ auth }: TemplateApiModuleActionProps) {
    return await this.friggClientService.getHealth(auth)
  }

  async getUserById({ auth }: TemplateApiModuleActionProps) {
    return await this.friggClientService.getUserById(auth)
  }

  async getAllSchoolsByMunicipality({ auth }: TemplateApiModuleActionProps) {
    return await this.friggClientService.getAllSchoolsByMunicipality(auth)
  }
}
