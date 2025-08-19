import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  EducationType,
  UnemploymentBenefitsAnswers,
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
import { x } from 'pdfkit'
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

    //Other information
    const otherInformationFromService =
      getValueViaPath<GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsOtherInformationDTO>(
        application.externalData,
        'unemploymentApplication.data.otherInformation',
        {},
      )

    const otherInformationFromAnswers = {
      requestedWorkRatio: parseInt(answers.jobWishes.wantedJobPercentage),
      requestedWorkRatioType:
        answers.jobWishes.wantedJobPercentage === '100' ? '0' : '1',
      canStartAt: new Date(answers.jobWishes.jobTimelineStartDate),
      //TODO check what alternateServiceAreas are -> If we have it then otherInformationFromService is uneccesary
      introductoryMeetingLanguage: answers.introductoryMeeting.language,
    }

    const otherInformation = {
      ...otherInformationFromService,
      ...otherInformationFromAnswers,
    }

    // preferredJobs

    const preferredJobsFromAnswers = {
      jobs: answers.jobWishes.jobList.map((job) => {
        const chosenJob = jobCodes?.find((x) => x.id === job)
        return {
          id: chosenJob?.id,
          name: chosenJob?.name,
        }
      }),
    }

    //educationHistory

    const currentEducation = {
      educationId: answers.educationHistory.currentStudies?.levelOfStudy,
      educationSubCategoryId: answers.educationHistory.currentStudies?.degree,
      educationSubSubCategoryId:
        answers.educationHistory.currentStudies?.courseOfStudy,
    }

    const educationHistory = answers.educationHistory?.educationHistory.map(
      (education) => {
        return {
          educationId: education.levelOfStudy,
          educationSubCategoryId: education.degree,
          educationSubSubCategoryId: education.courseOfStudy,
          yearFinished: education.endOfStudy, // TODO check how galdur want this if not filled out
        }
      },
    )

    const educationInformation = {
      education: [currentEducation, ...educationHistory],
    }

    //jobCareer
    const jobCareerInformation = answers.employmentHistory.lastJobs.map(
      (job, index) => {
        let workHours
        let salary
        if (
          answers.currentSituation.currentSituationRepeater &&
          answers.currentSituation.currentSituationRepeater.length > 0
        ) {
          workHours = getValueViaPath<string>(
            answers.currentSituation.currentSituationRepeater[index],
            'workHours',
            '',
          )

          console.log('workHours', workHours)

          salary = getValueViaPath<string>(
            answers.currentSituation.currentSituationRepeater[index],
            'salary',
            '',
          )
          console.log('salary', salary)
        }
        const jobId = jobCodes?.find((x) => x.name === job.title)?.id
        return {
          employerSSN: job.employer?.nationalId,
          employer: job.employer?.name,
          started: new Date(job.startDate || ''),
          quit: new Date(job.endDate || ''),
          workRatio: parseInt(job.percentage || ''),
          workHours: workHours || '',
          salary: salary || '',
          jobName: job.title,
          jobId: jobId || '',
        }
      },
    )

    const jobCareer = { jobs: jobCareerInformation }

    // TODO check if I need to return the rest of the properties of jobs

    console.log('jobCareerInformation', jobCareerInformation)

    //drivingLicense

    const licenseInformation = {
      hasHeavyMachineryLicense:
        answers.licenses.hasHeavyMachineryLicense?.includes('YES'),
      drivingLicenses: answers.licenses.drivingLicenseTypes,
      heavyMachineryLicenses: answers.licenses.heavyMachineryLicensesTypes,
    }

    //attachments
    // TODO check how they want to handle attachments

    //childrenSupported

    const childrenSupportedNationalRegistry =
      answers.familyInformation.children.map((child) => {
        return {
          ssn: child.nationalId,
          name: child.name,
          //dateTo?
          //dateFrom?
          readOnly: true,
        }
      })

    const childrenSupportedAdded =
      answers.familyInformation.additionalChildren?.map((child) => {
        return {
          ssn: child.child?.nationalId,
          name: child.child?.name,
          //dateTo?
          //dateFrom?
          readOnly: false,
        }
      }) || []

    const childrenSupported = {
      children: [
        ...childrenSupportedNationalRegistry,
        ...childrenSupportedAdded,
      ],
    }

    //bankingPensionUnion
    const pensionFundOptions =
      getValueViaPath<
        Array<GaldurDomainModelsSettingsPensionFundsPensionFundDTO>
      >(
        application.externalData,
        'unemploymentApplication.data.supportData.pensionFunds',
        [],
      ) || []
    const pensionFundInformation = pensionFundOptions.find(
      (x) => x.id === answers.payout.pensionFund,
    )

    const unionOptions =
      getValueViaPath<Array<GaldurDomainModelsSettingsUnionsUnionDTO>>(
        application.externalData,
        'unemploymentApplication.data.supportData.unions',
        [],
      ) || []
    const unionInformation = unionOptions.find(
      (x) => x.id === answers.payout.union,
    )

    const privatePensionOptions =
      getValueViaPath<
        Array<GaldurDomainModelsSettingsPensionFundsPensionFundDTO>
      >(
        application.externalData,
        'unemploymentApplication.data.supportData.privatePensionFunds',
        [],
      ) || []

    const privatePensionFundInformation = privatePensionOptions.find(
      (x) => x.id === answers.payout.privatePensionFund,
    )

    const bankingPensionUnion = {
      bankId: answers.payout.bankAccount.bankNumber,
      ledgerId: answers.payout.bankAccount.ledger,
      accountNumber: answers.payout.bankAccount.accountNumber,
      pensionFund: {
        id: pensionFundInformation?.id || '',
        name: pensionFundInformation?.name || '',
        //TODO what is type?
        // TODO what dateFrom and dateTo?
        // TODO what to put in percentage?
      },
      union: {
        id: unionInformation?.id || '',
        name: unionInformation?.name || '',
        // TODO what dateFrom and dateTo?
      },
      supplementaryPensionFunds: [
        {
          id: privatePensionFundInformation?.id,
          name: privatePensionFundInformation?.name,
          percentage: parseInt(
            answers.payout.privatePensionFundPercentage || '',
          ),
          //TODO date from and date to?
          // TODO type?
        },
      ], //TODO why is this an array? should we be able to return more than 1?
      doNotPayToUnion: answers.payout.payToUnion === NO,
      bankName: '', // TODO check if we need bankName
      ledgerName: '', // TODO check if we need ledgerName
    }

    //personalTaxCredit
    const personalTaxCredit = {
      applicantTaxDiscount: {
        personalDiscountRatio: parseInt(answers.taxDiscount.taxDiscount),
      }, // TODO do we need datefrom, dateto and SSN?
      spouseTaxDiscount: null,
      usePersonalDiscount: parseInt(answers.taxDiscount.taxDiscount) > 0,
      useRemainingPersonalDiscount: false,
      usePersonalDiscountSpouse: false,
      useRemainingPersonalDiscountSpouse: false,
    }

    //employerSettlement

    const employerSettlement = {
      hasUnpaidVacationTime: answers.vacation.doYouHaveVacationDays === YES,
      unpaidVacations: answers.vacation.vacationDays?.map((vacation) => {
        return {
          unpaidVacationDays: parseInt(vacation.amount || ''),
          unpaidVacationStart: new Date(vacation.startDate || ''),
          unpaidVacationEnd: new Date(vacation.endDate || ''),
        }
      }), //TODO this is in days, is that right respone?
      // resignationEnds: '', //TODO what is this?
    }

    //languageKnowledge
    const languageKnowledge = {
      languages: answers.languageSkills.map((language) => {
        const languages =
          getValueViaPath<Array<GaldurDomainModelsSelectItem>>(
            application.externalData,
            'unemploymentApplication.data.supportData.languageKnowledge',
          ) || []
        return {
          id: language.language,
          name: languages.find((x) => x.id === language.language)?.name || '',
          readOnly:
            //These are the id's from icelandic and english from supportData
            language.language === 'a18e3090-6afb-4afb-a055-1f83bbe498e3' ||
            language.language === '6d3edede-8951-4621-a835-e04323300fa0',
          knowledge: language.skill,
          required:
            //These are the id's from icelandic and english from supportData
            language.language === 'a18e3090-6afb-4afb-a055-1f83bbe498e3' ||
            language.language === '6d3edede-8951-4621-a835-e04323300fa0',
        }
      }),
    }

    //workingCapacity
    const workingCapacity = {
      capacityId: answers.workingAbility.status,
      //TODO we are asking for medicalCertificate but not sending it
    }

    //pensionAndOtherPayments
    const pensionAndOtherPayments = {
      //TODO finish this page first
    }

    //previousOccupation
    const previousOccupation = {
      hasOwnBusinessPast36Months:
        answers.employmentHistory.isIndependent === YES, // TODO is this answer correct?
      unemploymentReasonCodeId: '', // TODO
      unemploymentReasonCodeName: '', // TODO
      additionalDetails: '', //TODO
      agreementConfirmation: false, //TODO
      bankruptcyConfirmation: false, //TODO
    }

    //jobStatus
    const jobStatus = {
      jobType: 1, // TODO what is this?
    }

    //euresInformation
    const euresInformation = {
      showOnEures: answers.euresJobSearch.agreement === YES,
    }

    //educationalQuestions
    const educationalQuestions = {
      educationRegisteredNow:
        answers.education.typeOfEducation === EducationType.CURRENT,
      educationRegisteredLastSemester:
        answers.education.typeOfEducation === EducationType.LAST_SEMESTER,
      educationFinishedWithDiploma:
        answers.education.didFinishLastSemester === YES ||
        answers.education.typeOfEducation === EducationType.LAST_YEAR, // TODO is this right?
      educationFinishedWithinLast12Months:
        answers.education.didFinishLastSemester === YES ||
        answers.education.typeOfEducation === EducationType.LAST_YEAR, // TODO is this right?
      educationRegisteredNextSemester:
        answers.education.appliedForNextSemester === YES,
    }

    //additionalInformation
    const additionalInformation = {
      information: '', // TODO what is this?
    }

    //assignedEmployees
    const assignedEmployees = {
      // TODO what is this?
    }

    //compensationInformation
    // TODO what is this?

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
              additionalInformation: additionalInformation,
              // assignedEmployees: assignedEmployees, // TODO what is this?
              // compensationInformation: {}, // TODO what is this?
            },
            save: true,
          },
      }
    this.vmstUnemploymentClientService.submitApplication(auth, submitResponse)
  }
}
