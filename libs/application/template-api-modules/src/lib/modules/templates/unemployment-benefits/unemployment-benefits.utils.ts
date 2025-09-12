import { S3Service } from '@island.is/nest/aws'
import { ExternalData, FormValue } from '@island.is/application/types'
import { FileResponse } from './types'
import { getValueViaPath, NO, YES } from '@island.is/application/core'
import {
  ApplicantInAnswers,
  CurrentEducationInAnswers,
  CurrentEmploymentInAnswers,
  CurrentSituationInAnswers,
  EducationHistoryInAnswers,
  EducationInAnswers,
  EducationType,
  EmploymentHistoryInAnswers,
  EmploymentStatus,
  FamilyInformationInAnswers,
  FileSchemaInAnswers,
  IntroductoryMeetingInAnswers,
  JobWishesInAnswers,
  LanguagesInAnswers,
  LicensesInAnswers,
  PayoutInAnswers,
  TaxDiscountInAnswers,
  VacationInAnswers,
  errorMsgs,
} from '@island.is/application/templates/unemployment-benefits'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  GaldurDomainModelsSelectItem,
  GaldurDomainModelsSettingsJobCodesJobCodeDTO,
  GaldurDomainModelsSettingsPensionFundsPensionFundDTO,
  GaldurDomainModelsSettingsUnionsUnionDTO,
} from '@island.is/clients/vmst-unemployment'

export const getPersonalInformation = (answers: FormValue) => {
  const applicant = getValueViaPath<ApplicantInAnswers>(answers, 'applicant')

  return {
    ssn: applicant?.nationalId,
    name: applicant?.name,
    address: applicant?.address,
    city: applicant?.city,
    email: applicant?.email,
    mobile: applicant?.phoneNumber,
    phone: applicant?.phoneNumber,
    passCode: applicant?.password,
    currentAddressDifferent:
      applicant?.otherAddressCheckbox &&
      applicant?.otherAddressCheckbox[0] === 'YES',
    currentAddress: applicant?.otherAddress,
    currentPostCodeId: applicant?.otherPostcode,
    postalCode: applicant?.postalCode,
  }
}

export const getJobWishes = (answers: FormValue) => {
  const jobWishes = getValueViaPath<JobWishesInAnswers>(answers, 'jobWishes')
  const introductoryMeeting = getValueViaPath<IntroductoryMeetingInAnswers>(
    answers,
    'introductoryMeeting',
  )
  return {
    requestedWorkRatio: parseInt(jobWishes?.wantedJobPercentage || ''),
    requestedWorkRatioType:
      jobWishes?.wantedJobPercentage === '100' ? '0' : '1',
    canStartAt: new Date(jobWishes?.jobTimelineStartDate || ''),
    //TODO check what alternateServiceAreas are -> If we have it then otherInformationFromService is uneccesary
    introductoryMeetingLanguage: introductoryMeeting?.language,
  }
}

export const getEducationInformation = (answers: FormValue) => {
  const currentEducationAnswers = getValueViaPath<CurrentEducationInAnswers>(
    answers,
    'education.currentEducation',
  )
  const educationHistoryInAnswers =
    getValueViaPath<Array<EducationHistoryInAnswers>>(
      answers,
      'educationHistory.educationHistory',
    ) || [] // TODO check if this works
  const currentEducation = {
    educationId: currentEducationAnswers?.levelOfStudy,
    educationSubCategoryId: currentEducationAnswers?.degree,
    educationSubSubCategoryId: currentEducationAnswers?.courseOfStudy,
  }

  const educationHistory = educationHistoryInAnswers.map((education) => {
    return {
      educationId: education.levelOfStudy,
      educationSubCategoryId: education.degree,
      educationSubSubCategoryId: education.courseOfStudy,
      yearFinished: education.endOfStudy,
    }
  })

  return {
    education: [currentEducation, ...educationHistory],
  }
}

export const getJobWishList = (
  answers: FormValue,
  jobCodes: Array<GaldurDomainModelsSettingsJobCodesJobCodeDTO>,
) => {
  const jobWishes = getValueViaPath<JobWishesInAnswers>(
    answers,
    'jobWishes.jobList',
  )

  return {
    jobs: jobWishes?.jobList.map((job) => {
      const chosenJob = jobCodes?.find((x) => x.id === job)
      return {
        id: chosenJob?.id,
        name: chosenJob?.name,
      }
    }),
  }
}

export const getJobCareer = (
  answers: FormValue,
  jobCodes: Array<GaldurDomainModelsSettingsJobCodesJobCodeDTO>,
) => {
  const employmentHistory = getValueViaPath<EmploymentHistoryInAnswers>(
    answers,
    'employmentHistory',
  )
  const currentJob =
    getValueViaPath<Array<CurrentEmploymentInAnswers>>(
      answers,
      'currentSituation.currentSituationRepeater',
    ) || []
  const jobCareer = employmentHistory?.lastJobs.map((job, index) => {
    let workHours
    let salary
    if (currentJob && currentJob.length > 0) {
      workHours = getValueViaPath<string>(currentJob[index], 'workHours', '')

      salary = getValueViaPath<string>(currentJob[index], 'salary', '')
    }
    const jobName = jobCodes?.find((x) => x.name === job.title)?.name
    return {
      employerSSN: job.employer?.nationalId,
      employer: job.employer?.name,
      started: new Date(job.startDate || ''),
      quit: new Date(job.endDate || ''),
      workRatio: parseInt(job.percentage || ''),
      workHours: workHours || '',
      salary: salary || '',
      jobName: job.title,
      jobCodeId: jobName || '',
    }
  })

  return { jobs: jobCareer || [] }
}

export const getLicenseInformation = (answers: FormValue) => {
  const licenses = getValueViaPath<LicensesInAnswers>(answers, 'licenses')

  return {
    hasHeavyMachineryLicense:
      licenses?.hasHeavyMachineryLicense?.includes('YES'),
    drivingLicenses: licenses?.drivingLicenseTypes,
    heavyMachineryLicenses: licenses?.heavyMachineryLicensesTypes,
  }
}

export const getSupportedChildren = (answers: FormValue) => {
  const familyInformation = getValueViaPath<FamilyInformationInAnswers>(
    answers,
    'familyInformation',
  )
  const childrenSupportedNationalRegistry =
    familyInformation?.children.map((child) => {
      return {
        ssn: child.nationalId,
        name: child.name,
        readOnly: true,
      }
    }) || []

  const childrenSupportedAdded =
    familyInformation?.additionalChildren?.map((child) => {
      return {
        ssn: child.child?.nationalId,
        name: child.child?.name,
        readOnly: false,
      }
    }) || []

  return {
    children: [...childrenSupportedNationalRegistry, ...childrenSupportedAdded],
  }
}

export const getBankinPensionUnion = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const payoutInformation = getValueViaPath<PayoutInAnswers>(answers, 'payout')
  const pensionFundOptions =
    getValueViaPath<
      Array<GaldurDomainModelsSettingsPensionFundsPensionFundDTO>
    >(
      externalData,
      'unemploymentApplication.data.supportData.pensionFunds',
      [],
    ) || []
  const pensionFundInformation = pensionFundOptions.find(
    (x) => x.id === payoutInformation?.pensionFund,
  )

  const unionOptions =
    getValueViaPath<Array<GaldurDomainModelsSettingsUnionsUnionDTO>>(
      externalData,
      'unemploymentApplication.data.supportData.unions',
      [],
    ) || []
  const unionInformation = unionOptions.find(
    (x) => x.id === payoutInformation?.union,
  )

  const privatePensionOptions =
    getValueViaPath<
      Array<GaldurDomainModelsSettingsPensionFundsPensionFundDTO>
    >(
      externalData,
      'unemploymentApplication.data.supportData.privatePensionFunds',
      [],
    ) || []

  const privatePensionFundInformation = privatePensionOptions.find(
    (x) => x.id === payoutInformation?.privatePensionFund,
  )

  return {
    bankId: payoutInformation?.bankAccount.bankNumber,
    ledgerId: payoutInformation?.bankAccount.ledger,
    accountNumber: payoutInformation?.bankAccount.accountNumber,
    pensionFund: {
      id: pensionFundInformation?.id || '',
      name: pensionFundInformation?.name || '',
    },
    union: {
      id: unionInformation?.id || '',
      name: unionInformation?.name || '',
    },
    supplementaryPensionFunds: [
      {
        id: privatePensionFundInformation?.id,
        name: privatePensionFundInformation?.name,
        percentage: parseInt(
          payoutInformation?.privatePensionFundPercentage || '',
        ),
      },
    ],
    doNotPayToUnion: payoutInformation?.payToUnion === NO,
  }
}

export const getPersonalTaxCredit = (answers: FormValue) => {
  const taxDiscount = getValueViaPath<TaxDiscountInAnswers>(
    answers,
    'taxDiscount',
  )
  return {
    applicantTaxDiscount: {
      personalDiscountRatio: parseInt(taxDiscount?.taxDiscount || ''),
    },
    spouseTaxDiscount: null,
    usePersonalDiscount: parseInt(taxDiscount?.taxDiscount || '') > 0,
    useRemainingPersonalDiscount: false,
    usePersonalDiscountSpouse: false,
    useRemainingPersonalDiscountSpouse: false,
  }
}

export const getEmployerSettlement = (answers: FormValue) => {
  const vacationInformation = getValueViaPath<VacationInAnswers>(
    answers,
    'vacation',
  )
  const currentSituation = getValueViaPath<CurrentSituationInAnswers>(
    answers,
    'currentSituation',
  )
  return {
    hasUnpaidVacationTime: vacationInformation?.doYouHaveVacationDays === YES,
    unpaidVacations: vacationInformation?.vacationDays?.map((vacation) => {
      return {
        unpaidVacationDays: parseInt(vacation.amount || ''),
        unpaidVacationStart: new Date(vacation.startDate || ''),
        unpaidVacationEnd: new Date(vacation.endDate || ''),
      }
    }),
    //This is definitely in the wrong place but to hard to fix in Galdur at this moment so it remains here
    resignationEnds:
      currentSituation?.status === EmploymentStatus.EMPLOYED &&
      currentSituation?.currentSituationRepeater &&
      currentSituation?.currentSituationRepeater.length > 0
        ? new Date(
            currentSituation.currentSituationRepeater[0].predictedEndDate || '',
          )
        : null,
  }
}

export const getLanguageSkills = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const languageSkills = getValueViaPath<Array<LanguagesInAnswers>>(
    answers,
    'languageSkills',
  )
  return {
    languages: languageSkills?.map((language) => {
      const languages =
        getValueViaPath<Array<GaldurDomainModelsSelectItem>>(
          externalData,
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
}

export const getEducationalQuestions = (answers: FormValue) => {
  const education = getValueViaPath<EducationInAnswers>(answers, 'education')
  return {
    educationRegisteredNow:
      education?.typeOfEducation === EducationType.CURRENT,
    educationRegisteredLastSemester:
      education?.typeOfEducation === EducationType.LAST_SEMESTER,
    educationFinishedWithDiploma:
      education?.didFinishLastSemester === YES ||
      education?.typeOfEducation === EducationType.LAST_YEAR, // TODO is this right?
    educationFinishedWithinLast12Months:
      education?.didFinishLastSemester === YES ||
      education?.typeOfEducation === EducationType.LAST_YEAR, // TODO is this right?
    educationRegisteredNextSemester: education?.appliedForNextSemester === YES,
  }
}

export const getFileInfo = async (
  answers: FormValue,
  s3Service: S3Service,
  applicationId: string,
  bucket: string,
  fileObject: FileSchemaInAnswers,
): Promise<FileResponse | undefined> => {
  //   const CV = getValueViaPath<CVAnswers>(answers, 'cv')
  //   if (!fileObject || CV.haveCV !== YES) return undefined
  const fileName = fileObject?.name || ''
  const fileType = getFileExtension(fileName) || ''
  const mimeType = getMimeType(fileType)
  const key = fileObject?.key || ''

  if (!mimeType || !fileName || !key) return undefined

  try {
    const content = await s3Service.getFileContent(
      {
        bucket: bucket,
        key: `${applicationId}/${key}`,
      },
      'base64',
    )

    // s3Service on error only logs the error but doesn't throw so if we get undefined back there was an error
    if (!content) {
      throw new TemplateApiError(
        {
          title: errorMsgs.successErrorTitle,
          summary: errorMsgs.cvS3Error,
        },
        500,
      )
    }

    const fileResponse: FileResponse = {
      fileName,
      fileType: mimeType,
      data: content || '',
    }
    return fileResponse
  } catch (e) {
    throw new TemplateApiError(
      {
        title: errorMsgs.successErrorTitle,
        summary: errorMsgs.cvS3Error,
      },
      500,
    )
  }
}

const getFileExtension = (fileName: string): string | undefined => {
  const parts = fileName.trim().split('.')
  if (parts.length < 2) return undefined // no extension found
  return parts.pop()?.toLowerCase()
}

const getMimeType = (fileType: string): string | undefined => {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return 'application/pdf'
    case 'png':
      return 'image/png'
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'doc':
      return 'application/msword'
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    default:
      return undefined
  }
}
