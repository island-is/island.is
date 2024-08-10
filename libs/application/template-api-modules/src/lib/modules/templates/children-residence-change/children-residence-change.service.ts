import { Inject, Injectable } from '@nestjs/common'
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
import { CRCApplication } from '@island.is/application/templates/children-residence-change'
import { PRESIGNED_BUCKET } from './constants'
import { SharedTemplateApiService } from '../../shared'
import {
  generateApplicationSubmittedEmail,
  generateSyslumennNotificationEmail,
  transferRequestedEmail,
} from './emailGenerators'
import { Application, ApplicationTypes } from '@island.is/application/types'
import { SmsService } from '@island.is/nova-sms'
import { syslumennDataFromPostalCode } from './utils'
import { applicationRejectedEmail } from './emailGenerators/applicationRejected'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { AwsService } from '@island.is/nest/aws'

type props = Override<
  TemplateApiModuleActionProps,
  { application: CRCApplication }
>

@Injectable()
export class ChildrenResidenceChangeService extends BaseTemplateApiService {
  constructor(
    private readonly syslumennService: SyslumennService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    @Inject(PRESIGNED_BUCKET) private readonly presignedBucket: string,
    private readonly smsService: SmsService,
    private readonly awsService: AwsService,
  ) {
    super(ApplicationTypes.CHILDREN_RESIDENCE_CHANGE)
  }

  async submitApplication({ application }: props) {
    const { answers, externalData } = application
    const { nationalRegistry } = externalData
    const applicant = nationalRegistry.data
    const s3FileName = `children-residence-change/${application.id}.pdf`
    const file = await this.awsService.getFile({
      bucket: this.presignedBucket,
      fileName: s3FileName,
    })

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

    if (!file.Body) {
      throw new Error('File content was undefined')
    }
    const fileB64 = await file.Body.transformToString('base64')
    const fileBinary = await file.Body.transformToString('binary')

    const attachments: Attachment[] = [
      {
        name: `Lögheimilisbreyting-barns-${applicant.nationalId}.pdf`,
        content: fileB64,
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
      signed: true,
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
      signed: true,
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
      reasonForChildrenResidenceChange: answers.residenceChangeReason ?? '',
      transferExpirationDate:
        durationType === 'temporary' && durationDate
          ? formatDate({ date: durationDate, formatter: 'dd.MM.yyyy' })
          : durationType,
    }

    if (!childResidenceInfo.future?.address?.postalCode) {
      throw new Error('Future residence postal code was not found')
    }

    const syslumennData = syslumennDataFromPostalCode(
      childResidenceInfo.future.address.postalCode,
    )

    const uploadDataName = 'Lögheimilisbreyting barns'

    const response = await this.syslumennService
      .uploadData(participants, attachments, extraData, uploadDataName)
      .catch(async () => {
        await this.sharedTemplateAPIService.sendEmailWithAttachment(
          generateSyslumennNotificationEmail,
          application as unknown as Application,
          fileBinary,
          syslumennData.email,
        )
        return undefined
      })

    await this.sharedTemplateAPIService.sendEmail(
      (props) =>
        generateApplicationSubmittedEmail(
          props,
          fileBinary,
          answers.parentA.email,
          syslumennData.name,
          response?.caseNumber,
        ),
      application as unknown as Application,
    )

    await this.sharedTemplateAPIService.sendEmail(
      (props) =>
        generateApplicationSubmittedEmail(
          props,
          fileBinary,
          answers.parentB.email,
          syslumennData.name,
          response?.caseNumber,
        ),
      application as unknown as Application,
    )

    return response
  }

  async sendNotificationToCounterParty({ application }: props) {
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
        'Þér hafa borist drög að samningi um breytt lögheimili barna og meðlag á Island.is. Samningurinn er aðgengilegur á island.is/minarsidur undir Umsóknir.',
      )
    }
  }

  async rejectApplication({ application }: props) {
    await this.sharedTemplateAPIService.sendEmail(
      applicationRejectedEmail,
      application as unknown as Application,
    )
  }
}
