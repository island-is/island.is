import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../types'
import { UnemploymentBenefitsAnswers } from '@island.is/application/templates/unemployment-benefits'
import {
  GaldurDomainModelsApplicantsApplicantProfileDTOsPersonalInformation,
  GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsOtherInformationDTO,
  GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsUnemploymentApplicationInformation,
  GaldurDomainModelsApplicationsUnemploymentApplicationsUnemploymentApplicationDto,
  UnemploymentApplicationCreateUnemploymentApplicationRequest,
  VmstUnemploymentClientService,
} from '@island.is/clients/vmst-unemployment'
import { getValueViaPath } from '@island.is/application/core'
import { name } from '@azure/msal-node/dist/packageMetadata'

@Injectable()
export class UnemploymentBenefitsService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
    private readonly vmstUnemploymentClientService: VmstUnemploymentClientService,
  ) {
    super(ApplicationTypes.UNEMPLOYMENT_BENEFITS)
  }

  async getEmptyApplication({
    auth,
  }: TemplateApiModuleActionProps): Promise<GaldurDomainModelsApplicationsUnemploymentApplicationsUnemploymentApplicationDto | null> {
    const results =
      await this.vmstUnemploymentClientService.getEmptyApplication(auth)

    // This also comes from result, might want to do something with this!
    // canApply: true
    // errorMessage: ""
    // hasApplicationInLast4Weeks: false
    // reopenApplication: false
    // success: true
    return results.unemploymentApplication || null
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers as UnemploymentBenefitsAnswers

    //unchanged:
    // applicationInformation
    // applicationAccess
    //electronicCommunication

    const personalInformationFromService =
      getValueViaPath<GaldurDomainModelsApplicantsApplicantProfileDTOsPersonalInformation>(
        application.externalData,
        'unemploymentApplication.data.personalInformation',
        {},
      )

    const personalInformationFromAnswers = {
      ssn: answers.applicant.nationalId,
      name: answers.applicant.name,
      address: answers.applicant.address,
      city: answers.applicant.city,
      email: answers.applicant.email,
      mobile: answers.applicant.phoneNumber,
      phone: answers.applicant.phoneNumber,
      passCode: answers.applicant.password,
      currentAddressDifferent:
        answers.applicant.otherAddressCheckbox &&
        answers.applicant.otherAddressCheckbox[0] === 'YES',
      currentAddress: answers.applicant.otherAddress,
      currentPostCodeId: answers.applicant.otherPostcode,
      postalCode: answers.applicant.postalCode,
    }

    const personalInformation = {
      ...personalInformationFromService,
      ...personalInformationFromAnswers,
    }

    const otherInformationFromService =
      getValueViaPath<GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsOtherInformationDTO>(
        application.externalData,
        'unemploymentApplication.data.personalInformation',
        {},
      )

    throw new Error('dont work please')

    // const submitResponse: UnemploymentApplicationCreateUnemploymentApplicationRequest =
    //   {
    //     galdurApplicationApplicationsUnemploymentApplicationsCommandsCreateUnemploymentApplicationCreateUnemploymentApplicationCommand:
    //       {
    //         unemploymentApplication: {},
    //         save: true,
    //       },
    //   }
    // this.vmstUnemploymentClientService.submitApplication(auth, submitResponse)
  }
}
