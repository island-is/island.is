import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  SyslumennService,
  Person,
  Attachment,
  PersonType,
} from '@island.is/clients/syslumenn'
import {
  getSelectedChildrenFromExternalData,
  formatDate,
  childrenResidenceInfo,
} from '@island.is/application/templates/family-matters-core/utils'
import { Override } from '@island.is/application/templates/family-matters-core/types'
import { CRCApplication } from '@island.is/application/templates/children-residence-change-v2'
import { SharedTemplateApiService } from '../../shared'
import {
  applicationRejectedByOrganizationEmail,
  generateApplicationSubmittedEmail,
  generateSyslumennNotificationEmail,
  transferRequestedEmail,
} from './emailGenerators'
import { Application, ApplicationTypes } from '@island.is/application/types'
import { SmsService } from '@island.is/nova-sms'
import { syslumennDataFromPostalCode } from './utils'
import { applicationRejectedEmail } from './emailGenerators/applicationRejected'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { isValidNumberForRegion } from 'libphonenumber-js'
import { generateResidenceChangePdf } from './pdfGenerators'

type Props = Override<
  TemplateApiModuleActionProps,
  { application: CRCApplication }
>

@Injectable()
export class ChildrenResidenceChangeServiceV2 extends BaseTemplateApiService {
  constructor(
    private readonly syslumennService: SyslumennService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly smsService: SmsService,
    private nationalRegistryApi: NationalRegistryClientService,
  ) {
    super(ApplicationTypes.CHILDREN_RESIDENCE_CHANGE_V2)
  }

  async submitApplication({ application }: Props) {
    const { answers, externalData } = application
    const { nationalRegistry } = externalData
    const applicant = nationalRegistry.data
    const pdf = await generateResidenceChangePdf(application)

    const selectedChildren = getSelectedChildrenFromExternalData(
      externalData.childrenCustodyInformation.data,
      answers.selectedChildren,
    )

    const otherParent = selectedChildren[0].otherParent

    const childResidenceInfo = childrenResidenceInfo(
      applicant,
      externalData.childrenCustodyInformation.data,
      answers.selectedChildren,
    )
    const currentAddress = childResidenceInfo?.current?.address

    const attachments: Attachment[] = [
      {
        name: `Lögheimilisbreyting-barns-${applicant.nationalId}.pdf`,
        content: pdf.toString('base64'),
      },
    ]

    const parentA: Person = {
      name: applicant.fullName,
      ssn: applicant.nationalId,
      phoneNumber: answers.parentA.phoneNumber,
      email: answers.parentA.email,
      homeAddress: applicant?.address?.streetAddress ?? '',
      postalCode: applicant?.address?.postalCode ?? '',
      city: applicant.address?.locality ?? '',
      signed: false,
      type: PersonType.Plaintiff,
    }

    if (!otherParent) {
      throw new Error('Parent B was undefined')
    }

    const parentB: Person = {
      name: otherParent.fullName,
      ssn: otherParent.nationalId,
      phoneNumber: answers.parentB.phoneNumber,
      email: answers.parentB.email,
      homeAddress: otherParent.address?.streetAddress || '',
      postalCode: otherParent.address?.postalCode || '',
      city: otherParent.address?.locality || '',
      signed: false,
      type: PersonType.CounterParty,
    }

    const participants: Array<Person> = selectedChildren.map((child) => {
      return {
        name: child.fullName,
        ssn: child.nationalId,
        homeAddress: currentAddress?.streetAddress || '',
        postalCode: currentAddress?.postalCode || '',
        city: currentAddress?.locality || '',
        signed: false,
        type: PersonType.Child,
      }
    })

    participants.push(parentA, parentB)

    const durationType = answers.selectDuration?.type
    const durationDate = answers.selectDuration?.date
    const extraData = {
      applicationId: application.id,
      typeOfChildSupport: answers.selectChildSupportPayment,
      reasonForChildrenResidenceChange: answers.residenceChangeReason ?? '',
      transferExpirationDate:
        durationType === 'temporary' && durationDate
          ? formatDate({ date: durationDate, formatter: 'dd.MM.yyyy' })
          : durationType,
    }

    if (!childResidenceInfo.future?.address?.postalCode) {
      throw new Error('Future residence postal code was not found')
    }

    // Validate phone numbers of parents before sending to syslumenn
    if (!isValidNumberForRegion(parentA.phoneNumber ?? '', 'IS')) {
      throw new Error('Parent A phone number is not valid')
    }

    if (!isValidNumberForRegion(parentB.phoneNumber ?? '', 'IS')) {
      throw new Error('Parent B phone number is not valid')
    }

    const syslumennData = syslumennDataFromPostalCode(
      childResidenceInfo.future.address.postalCode,
    )

    const uploadDataName = 'Samningur Forsjá Og Meðlag'
    const uploadDataId = 'Lögheimilisbreyting-barns'
    const response = await this.syslumennService
      .uploadData(
        participants,
        attachments,
        extraData,
        uploadDataName,
        uploadDataId,
      )
      .catch(async () => {
        await this.sharedTemplateAPIService.sendEmailWithAttachment(
          generateSyslumennNotificationEmail,
          application as unknown as Application,
          pdf.toString('binary'),
          syslumennData.email,
        )
        return undefined
      })
    return response
  }

  async sendNotificationToCounterParty({ application }: Props) {
    const { answers } = application
    const { counterParty } = answers

    if (counterParty.email) {
      await this.sharedTemplateAPIService.sendEmail(
        transferRequestedEmail,
        application as unknown as Application,
      )
    }

    if (counterParty.phoneNumber) {
      await this.smsService.sendSms(
        counterParty.phoneNumber,
        'Þér hafa borist drög að samningi um breytt lögheimili barns á Island.is. Samningurinn er aðgengilegur á island.is/minarsidur undir Umsóknir.',
      )
    }
  }

  // Sends notification to both parties
  async approvedByOrganization({ application }: Props) {
    const { answers, externalData } = application
    const { parentA, parentB } = answers
    const { nationalRegistry } = externalData
    const applicant = nationalRegistry.data
    const childResidenceInfo = childrenResidenceInfo(
      applicant,
      externalData.childrenCustodyInformation.data,
      answers.selectedChildren,
    )
    const caseNumber = externalData.submitApplication?.data?.caseNumber

    if (!childResidenceInfo.future?.address?.postalCode) {
      throw new Error('Future residence postal code was not found')
    }

    const pdf = await generateResidenceChangePdf(application)
    const syslumennData = syslumennDataFromPostalCode(
      childResidenceInfo.future.address.postalCode,
    )

    await this.sharedTemplateAPIService.sendEmail(
      (props) =>
        generateApplicationSubmittedEmail(
          props,
          pdf.toString('binary'),
          parentA.email,
          syslumennData.name,
          caseNumber,
        ),
      application as unknown as Application,
    )

    await this.sharedTemplateAPIService.sendEmail(
      (props) =>
        generateApplicationSubmittedEmail(
          props,
          pdf.toString('binary'),
          parentB.email,
          syslumennData.name,
          caseNumber,
        ),
      application as unknown as Application,
    )
  }

  async rejectedByCounterParty({ application }: Props) {
    await this.sharedTemplateAPIService.sendEmail(
      applicationRejectedEmail,
      application as unknown as Application,
    )
  }

  async rejectedByOrganization({ application }: Props) {
    await this.sharedTemplateAPIService.sendEmail(
      applicationRejectedByOrganizationEmail,
      application as unknown as Application,
    )
  }
}
