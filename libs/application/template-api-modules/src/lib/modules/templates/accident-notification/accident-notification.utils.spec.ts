import {
  AccidentNotificationAnswers,
  AccidentTypeEnum,
  AttachmentsEnum,
  FishermanWorkplaceAccidentShipLocationEnum,
  PowerOfAttorneyUploadEnum,
  ReviewApprovalEnum,
  StudiesAccidentTypeEnum,
  WhoIsTheNotificationForEnum,
  WorkAccidentTypeEnum,
  OnBehalf,
  StudiesAccidentLocationEnum,
} from '@island.is/application/templates/accident-notification'
import * as utils from './accident-notification.utils'
import {
  AccidentNotificationAttachment,
  AttachmentTypeEnum,
} from './types/attachments'
import {
  Application,
  FormValue,
} from '@island.is/application/types'

describe('applicationAnswersToXml', () => {
  it.each([
    AccidentTypeEnum.SPORTS,
    AccidentTypeEnum.RESCUEWORK,
    AccidentTypeEnum.STUDIES,
  ])(
    'should map correctly for a person reporting an injury for themselves, injured in sports, rescue work or studies, with no employer involved',
    (accidentType) => {
      const attachments = getDefaultAttachments()
      const answers = getFullBasicAnswers()

      answers.accidentType.radioButton = accidentType
      const companyInfoCache = answers.companyInfo
      answers.companyInfo = undefined

      const result = utils.applicationAnswersToXml(answers, attachments)

      expect(result.includes(answers.applicant.name)).toBeTruthy()
      expect(result.includes(answers.applicant.phoneNumber)).toBeTruthy()
      expect(result.includes(answers.applicant.nationalId)).toBeTruthy()
      expect(result.includes(answers.accidentDetails.dateOfAccident)).toBeTruthy()
      expect(result.includes((answers as any)['locationAndPurpose?'].location)).toBeTruthy()
      expect(result.includes(attachments[0].name)).toBeTruthy()
      expect(result.includes(attachments[1].name)).toBeTruthy()

      expect(result.includes(answers.childInCustody.name)).toBeFalsy()
      expect(result.includes(answers.injuredPersonInformation.name)).toBeFalsy()
      expect(result.includes(companyInfoCache?.name as string)).toBeFalsy()
    },
  )

  it.each([
    { type: AccidentTypeEnum.HOMEACTIVITIES, fisherman: false },
    { type: AccidentTypeEnum.WORK, fisherman: false },
    { type: AccidentTypeEnum.WORK, fisherman: true },
  ])(
    'should map correctly for a person reporting an injury for themselves, injured in at home or at work, with employer involved',
    (data) => {
      const attachments = getDefaultAttachments()
      const answers = getFullBasicAnswers()

      answers.accidentType.radioButton = data.type
      answers.workMachineRadio = 'yes'
      if (data.fisherman)
        answers.workAccident.type = WorkAccidentTypeEnum.FISHERMAN

      const result = utils.applicationAnswersToXml(answers, attachments)

      expect(result.includes(answers.applicant.name)).toBeTruthy()
      expect(result.includes(answers.applicant.phoneNumber)).toBeTruthy()
      expect(result.includes(answers.applicant.nationalId)).toBeTruthy()
      expect(result.includes(answers.accidentDetails.dateOfAccident)).toBeTruthy()
      expect(result.includes((answers as any)['locationAndPurpose?'].location)).toBeTruthy()
      expect(result.includes(attachments[0].name)).toBeTruthy()
      expect(result.includes(attachments[1].name)).toBeTruthy()

      expect(result.includes(answers.childInCustody.name)).toBeFalsy()
      expect(result.includes(answers.injuredPersonInformation.name)).toBeFalsy()

      const isHomeAccident = data.type === AccidentTypeEnum.HOMEACTIVITIES
      expect(result.includes(answers.companyInfo?.name as string)).toBe(!isHomeAccident)
      expect(result.includes(answers.homeAccident?.address)).toBe(isHomeAccident)
      expect(result.includes(answers.homeAccident?.postalCode)).toBe(
        isHomeAccident,
      )
      expect(result.includes(answers.homeAccident?.community)).toBe(
        isHomeAccident,
      )
      expect(result.includes(answers.homeAccident?.moreDetails as string)).toBe(
        isHomeAccident,
      )

      if (!isHomeAccident) {
        expect(result.includes(answers.fishingShipInfo?.shipName)).toBe(data.fisherman)
        expect(result.includes(answers.fishingShipInfo?.shipCharacters)).toBe(data.fisherman)
        expect(
          result.includes(answers.workMachine?.descriptionOfMachine),
        ).toBe(!data.fisherman)
      }
    },
  )

  it.each([
    {
      for: WhoIsTheNotificationForEnum.ME,
      someoneElse: false,
      shouldHaveCompanyInfo: false,
    },
    {
      for: WhoIsTheNotificationForEnum.POWEROFATTORNEY,
      someoneElse: true,
      shouldHaveCompanyInfo: false,
    },
    {
      for: WhoIsTheNotificationForEnum.JURIDICALPERSON,
      someoneElse: true,
      shouldHaveCompanyInfo: true,
    },
    {
      for: WhoIsTheNotificationForEnum.CHILDINCUSTODY,
      someoneElse: true,
      shouldHaveCompanyInfo: false,
    },
  ])(
    'should map correctly for a person reporting an injury for themselves, someone else, juridical person, or their child, with no employer involved',
    (data) => {
      const attachments = getDefaultAttachments()
      const answers = getFullBasicAnswers()
      answers.whoIsTheNotificationFor.answer = data.for
      const companyInfoCache = answers.companyInfo
      answers.companyInfo = undefined

      const result = utils.applicationAnswersToXml(answers, attachments)
      
      expect(result.includes(answers.applicant.name)).toBeTruthy()
      if (data.someoneElse) {
        data.for === WhoIsTheNotificationForEnum.CHILDINCUSTODY
          ? expect(
              result.includes(answers.childInCustody.name) &&
                !result.includes(answers.injuredPersonInformation.name),
            ).toBeTruthy()
          : expect(
              result.includes(answers.injuredPersonInformation.name) &&
                !result.includes(answers.childInCustody.name),
            ).toBeTruthy()

        data.for === WhoIsTheNotificationForEnum.JURIDICALPERSON
          ? expect(result.includes(answers.juridicalPerson.companyName)).toBeTruthy()
          : expect(result.includes(answers.juridicalPerson.companyName)).toBeFalsy()
      }
      expect(result.includes(answers.applicant.phoneNumber)).toBeTruthy()
      expect(result.includes(answers.applicant.nationalId)).toBeTruthy()
      expect(result.includes(answers.accidentDetails.dateOfAccident)).toBeTruthy()
      expect(result.includes((answers as any)['locationAndPurpose?'].location)).toBeTruthy()
      expect(result.includes(attachments[0].name)).toBeTruthy()
      expect(result.includes(attachments[1].name)).toBeTruthy()

      expect(result.includes(companyInfoCache?.name as string)).toBeFalsy()
    },
  )
})

const createMockPartialApplication = (documentId?: number): Application =>
  ({
    externalData: {
      submitApplication: {
        data: documentId
          ? { documentId, sentDocuments: ['hello', 'there'] }
          : undefined,
      },
    },
  } as unknown as Application)

describe('getApplicationDocumentId', () => {
  it('should return a valid application submission document id', () => {
    const expectedId = 5555
    const application = createMockPartialApplication(expectedId)

    const result = utils.getApplicationDocumentId(application)
    expect(result).toEqual(expectedId)
  })

  it('should throw when there is no valid application submission document id', () => {
    const application = createMockPartialApplication(undefined)

    expect(() => utils.getApplicationDocumentId(application)).toThrowError(
      'No documentId found on application',
    )
  })
})

const getDefaultAttachments = (): AccidentNotificationAttachment[] => {
  return [
    {
      content: 'InjurcyCertDocContent',
      attachmentType: AttachmentTypeEnum.INJURY_CERTIFICATE,
      name: 'InjurcyCertDoc.pdf',
      hash: 'InjurcyCertDocHash',
    },
    {
      content: 'PoliceReportDocContent',
      attachmentType: AttachmentTypeEnum.POLICE_REPORT,
      name: 'PoliceReportDoc.pdf',
      hash: 'PoliceReportDocHash',
    },
  ]
}

const getFullBasicAnswers = (): AccidentNotificationAnswers => {
  return {
    applicant: {
      name: 'Fullname Fullname',
      nationalId: '1234564321',
      email: 'mock@mockemail.com',
      phoneNumber: '7654321',
      address: 'Bær 1',
      city: 'Reykjavik',
      postalCode: '101',
    },
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.ME,
    },
    childInCustody: {
      name: 'Some Kid',
      nationalId: '1234564332',
    },
    injuredPersonInformation: {
      name: 'Fullername Fullername',
      nationalId: '1234564322',
      email: 'mockmock@mockemail.com',
      phoneNumber: '7654322',
      jobTitle: '',
    },
    accidentType: {
      radioButton: AccidentTypeEnum.SPORTS,
    },
    accidentDetails: {
      dateOfAccident: '1999-09-19',
      timeOfAccident: '18:00:00',
      descriptionOfAccident: 'Hurt',
      accidentSymptoms: 'Pain',
      isHealthInsured: 'yes',
      dateOfDoctorVisit: '',
      timeOfDoctorVisit: '',
    },
    homeAccident: {
      address: 'homeAccidentAddress123',
      postalCode: 'homeAccidentAddress123PortalCode100',
      community: 'wtfIsCommunityHere?Kopavogur',
      moreDetails: 'more detail about home accident',
    },
    workAccident: {
      type: WorkAccidentTypeEnum.GENERAL,
      jobTitle: '',
    },
    wasTheAccidentFatal: 'no',
    carAccidentHindrance: 'no',
    // getValueViaPath can find this when this object isnt types but is stringified
    // so we need to have this as a string to accomidate the ? when using the typed version
    'locationAndPurpose?': { 
      location: 'Somewhere',
    },
    accidentLocation: {
      answer: StudiesAccidentLocationEnum.OTHER,
    },
    shipLocation: {
      answer: FishermanWorkplaceAccidentShipLocationEnum.SAILINGORFISHING,
    },
    fishingShipInfo: {
      shipName: 'SomeShipName',
      shipCharacters: 'SomeShipCharacters',
      homePort: 'SomeHomePort',
      shipRegisterNumber: 'ShomeShipRegNr123',
    },
    workMachineRadio: 'yes',
    workMachine: {
      descriptionOfMachine: 'description of machine that messed someone up',
    },
    companyInfo: {
      nationalRegistrationId: '7654324321',
      name: 'Company EHF',
    },
    representative: {
      name: 'Some Guy',
      nationalId: '6543214321',
      email: 'rep@mockemail.com',
      phoneNumber: '1111111',
    },
    approveExternalData: false,
    externalData: {
      nationalRegistry: {
        status: 'success',
        data: {
          nationalId: '',
          address: {
            locality: '',
            municipalityCode: '',
            postalCode: '',
            streetAddress: '',
          },
          age: 0,
          citizenship: {
            code: '',
            name: '',
          },
          fullName: '',
        },
        date: '',
      },
      userProfile: {
        data: {
          email: '',
          mobilePhoneNumber: '',
        },
      },
    },
    info: {
      onBehalf: OnBehalf.MYSELF,
    },
    timePassedHindrance: 'yes',
    injuryCertificate: {
      answer: AttachmentsEnum.INJURYCERTIFICATE,
    },
    additionalAttachments: {
      answer: AttachmentsEnum.ADDITIONALLATER,
    },
    attachments: {},
    fatalAccidentUploadDeathCertificateNow: 'yes',
    onPayRoll: {
      answer: 'yes',
    },
    studiesAccident: {
      type: StudiesAccidentTypeEnum.INTERNSHIP,
    },
    juridicalPerson: {
      companyName: 'juridicalPersonCompany',
      companyNationalId: '7777778888',
      companyConfirmation: [],
    },
    powerOfAttorney: {
      type: PowerOfAttorneyUploadEnum.UPLOADLATER,
    },
    reviewApproval: ReviewApprovalEnum.NOTREVIEWED,
  } as unknown as AccidentNotificationAnswers
}
