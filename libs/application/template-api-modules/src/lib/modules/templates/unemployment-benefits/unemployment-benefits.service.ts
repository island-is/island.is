import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  EducationType,
  EmploymentStatus,
} from '@island.is/application/templates/unemployment-benefits'
import {
  GaldurDomainModelsApplicantsApplicantProfileDTOsElectronicCommunication,
  GaldurDomainModelsApplicantsApplicantProfileDTOsPersonalInformation,
  GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsOtherInformationDTO,
  GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsUnemploymentApplicationAccess,
  GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsUnemploymentApplicationInformation,
  GaldurDomainModelsApplicationsUnemploymentApplicationsUnemploymentApplicationDto,
  GaldurDomainModelsSelectItem,
  GaldurDomainModelsSettingsJobCodesJobCodeDTO,
  GaldurDomainModelsSettingsPensionFundsPensionFundDTO,
  GaldurDomainModelsSettingsUnionsUnionDTO,
  UnemploymentApplicationCreateUnemploymentApplicationRequest,
  VmstUnemploymentClientService,
} from '@island.is/clients/vmst-unemployment'
import { getValueViaPath, NO, YES } from '@island.is/application/core'
import {
  getBankinPensionUnion,
  getEducationalQuestions,
  getEducationInformation,
  getEmployerSettlement,
  getJobCareer,
  getJobWishes,
  getJobWishList,
  getLanguageSkills,
  getLicenseInformation,
  getPersonalInformation,
  getPersonalTaxCredit,
  getSupportedChildren,
} from './unemployment-benefits.utils'

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
    const { answers, externalData } = application

    const jobCodes =
      getValueViaPath<GaldurDomainModelsSettingsJobCodesJobCodeDTO[]>(
        application.externalData,
        'unemploymentApplication.data.supportData.jobCodes',
      ) ?? []

    //unchanged:
    // applicationInformation
    // applicationAccess
    //electronicCommunication
    const applicationInformation =
      getValueViaPath<GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsUnemploymentApplicationInformation>(
        application.externalData,
        'unemploymentApplication.data.applicationInformation',
        {},
      )
    const applicationAccess =
      getValueViaPath<GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsUnemploymentApplicationAccess>(
        application.externalData,
        'unemploymentApplication.data.applicationAccess',
        {},
      )

    const electronicCommunication =
      getValueViaPath<GaldurDomainModelsApplicantsApplicantProfileDTOsElectronicCommunication>(
        application.externalData,
        'unemploymentApplication.data.electronicCommunication',
        {},
      )

    //personalInformation
    const personalInformationFromService =
      getValueViaPath<GaldurDomainModelsApplicantsApplicantProfileDTOsPersonalInformation>(
        application.externalData,
        'unemploymentApplication.data.personalInformation',
        {},
      )

    const personalInformationFromAnswers = getPersonalInformation(answers)

    const personalInformation = {
      ...personalInformationFromService,
      ...personalInformationFromAnswers,
    }

    //Other information
    const otherInformationFromService =
      getValueViaPath<GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsOtherInformationDTO>(
        application.externalData,
        'unemploymentApplication.data.otherInformation',
        {},
      )

    const otherInformationFromAnswers = getJobWishes(answers)
    const otherInformation = {
      ...otherInformationFromService,
      ...otherInformationFromAnswers,
    }

    // preferredJobs
    const preferredJobsFromAnswers = getJobWishList(answers, jobCodes)

    //educationHistory
    const educationInformation = getEducationInformation(answers)

    //jobCareer
    const jobCareer = getJobCareer(answers, jobCodes)

    //drivingLicense
    const licenseInformation = getLicenseInformation(answers)

    //attachments
    // Læknistvottorð - ástæða atvinnuleitar
    // starfhæfnisvottorð - vinnufærni - answers.

    // Staðfesting á námi/prófgráðu - menntun
    // staðfsting á sjúkradagpeningum - aðrar bætur og lífeyrir
    // fleiri dálkar úr þjónustu - aðrar bætur og lífeyrir
    // ferilskrá - ferilskrá

    //childrenSupported
    const childrenSupported = getSupportedChildren(answers)

    //bankingPensionUnion

    const bankingPensionUnion = getBankinPensionUnion(answers, externalData)

    //personalTaxCredit
    const personalTaxCredit = getPersonalTaxCredit(answers)

    //employerSettlement

    const employerSettlement = getEmployerSettlement(answers)

    //languageKnowledge
    const languageKnowledge = getLanguageSkills(answers, externalData)

    //workingCapacity
    const workingCapacity = {
      capacityId: getValueViaPath<string>(answers, 'workingAbility.status'),
    }

    //pensionAndOtherPayments
    const pensionAndOtherPayments = {
      //TODO finish this page first
    }

    //previousOccupation
    const previousOccupation = {
      // hasOwnBusinessPast36Months:
      //   answers.employmentHistory.isIndependent === YES, // TODO
      unemploymentReasonCodeId: '', // TODO
      unemploymentReasonCodeName: '', // TODO
      additionalDetails: '', //TODO
      agreementConfirmation: false, //TODO
      bankruptcyConfirmation: false, //TODO
    }

    //jobStatus
    const jobStatus = {
      jobType: 1, // TODO map to hardcoded values from odinn
    }

    //euresInformation
    const euresInformation = {
      showOnEures:
        getValueViaPath<string>(answers, 'euresJobSearch.agreement') === YES,
    }

    //educationalQuestions
    const educationalQuestions = getEducationalQuestions(answers)

    // throw new Error('dont work please')

    const submitResponse: UnemploymentApplicationCreateUnemploymentApplicationRequest =
      {
        galdurApplicationApplicationsUnemploymentApplicationsCommandsCreateUnemploymentApplicationCreateUnemploymentApplicationCommand:
          {
            unemploymentApplication: {
              applicationInformation: applicationInformation,
              applicationAccess: applicationAccess,
              personalInformation: personalInformation,
              electronicCommunication: electronicCommunication,
              otherInformation: otherInformation,
              preferredJobs: preferredJobsFromAnswers,
              educationHistory: educationInformation,
              jobCareer: jobCareer,
              drivingLicense: licenseInformation,
              //attachments
              childrenSupported: childrenSupported,
              bankingPensionUnion: bankingPensionUnion,
              personalTaxCredit: personalTaxCredit,
              employerSettlement: employerSettlement,
              languageKnowledge: languageKnowledge,
              workingCapacity: workingCapacity,
              pensionAndOtherPayments: pensionAndOtherPayments,
              previousOccupation: previousOccupation,
              jobStatus: jobStatus,
              euresInformation: euresInformation,
              educationalQuestions: educationalQuestions,
              applicantId: null,
            },
            save: true,
            finalize: true,
          },
      }
    this.vmstUnemploymentClientService.submitApplication(auth, submitResponse)
  }
}
