import { getApplicationAnswers } from '@island.is/application/templates/new-primary-school'
import { ApplicationTypes } from '@island.is/application/types'
import { FriggClientService } from '@island.is/clients/mms/frigg'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'

@Injectable()
export class NewPrimarySchoolService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly friggClientService: FriggClientService,
  ) {
    super(ApplicationTypes.NEW_PRIMARY_SCHOOL)
  }

  async getKeyOptionsTypes({ auth }: TemplateApiModuleActionProps) {
    return await this.friggClientService.getKeyOptionsTypes(auth)
  }

  async getAllKeyOptions({ auth }: TemplateApiModuleActionProps) {
    return await this.friggClientService.getAllKeyOptions(auth, undefined)
  }

  async getAllSchoolsByMunicipality({ auth }: TemplateApiModuleActionProps) {
    return await this.friggClientService.getAllSchoolsByMunicipality(auth)
  }

  async setChildInformation({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const { childNationalId } = getApplicationAnswers(application.answers)

    return await this.friggClientService.getUserById(auth, childNationalId)
  }
}
