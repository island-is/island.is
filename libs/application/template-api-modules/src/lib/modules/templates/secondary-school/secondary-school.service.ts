import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
// import { SecondarySchoolAnswers } from '@island.is/application/templates/secondary-school'
import {
  SecondarySchool,
  SecondarySchoolClient,
} from '@island.is/clients/secondary-school'
import { TemplateApiError } from '@island.is/nest/problem'
import { error } from '@island.is/application/templates/secondary-school'

@Injectable()
export class SecondarySchoolService extends BaseTemplateApiService {
  constructor(private readonly secondarySchoolClient: SecondarySchoolClient) {
    super(ApplicationTypes.SECONDARY_SCHOOL)
  }

  async getSchools(): Promise<SecondarySchool[]> {
    return this.secondarySchoolClient.getSchools()
  }

  async validateCanCreate({
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const canCreate = this.secondarySchoolClient.validateCanCreate(auth)

    if (!canCreate) {
      throw new TemplateApiError(
        {
          title: error.errorValidateCanCreateTitle,
          summary: error.errorValidateCanCreateDescription,
        },
        400,
      )
    }
  }

  async deleteApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    return this.secondarySchoolClient.delete(auth, application.id)
  }

  async submitApplication({
    // application,
    auth,
  }: TemplateApiModuleActionProps): Promise<string> {
    // const answers = application.answers as SecondarySchoolAnswers

    return this.secondarySchoolClient.create(auth, {
      nationalId: auth.nationalId,
    })
  }
}
