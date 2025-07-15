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
// import { getJobString } from 'libs/application/templates/unemployment-benefits/src/utils/stringMappers'

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

    // TODO otherinformation from answers after refactoring

    const preferredJobsFromAnswers = {
      preferredJobs: {
        jobs: answers.jobWishes.jobList.map((job) => {
          return {
            id: job,
          }
        }),
      },
    }

    const educationHistoryFromAnswers = {
      educationHistory: answers.educationHistory?.educationHistory.map(
        (education) => {
          return {
            educationId: education.levelOfStudy,
            educationSubCategoryId: education.degree,
            educationSubSubCategoryId: education.courseOfStudy,
          }
        },
      ),
    }

    const lasJobFromAnswers = {
      lastJob: {
        employerSSN: answers.employmentHistory?.lastJob?.companyNationalId,
        employer: answers.employmentHistory?.lastJob?.companyName,
        started: answers.employmentHistory?.lastJob?.startDate,
        quit: answers.employmentHistory?.lastJob?.endDate,
        workRatio: answers.employmentHistory?.lastJob?.percentage,
        // workHours: answers.currentSituation.currentJob?.workHours,
        // salary: answers.currentSituation?.currentJob?.salary,
        jobName: answers.employmentHistory?.lastJob?.title,
      },
    }
    // const previousJobsFromAnswers = {
    //   jobCareer: answers.employmentHistory?.previousJobs.map((job) => {
    //     return {
    //       employer: job.employer,
    //       percentage: job.percentage,
    //       startDate: job.startDate,
    //       workHours: job.workHours,
    //       salary: job.salary,
    //       endDate: job.endDate,
    //       jobTitle: job.jobTitle,
    //       jobDescription: job.jobDescription,
    //     }
    //   })
    // }

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
