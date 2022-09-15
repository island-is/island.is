import { Injectable, Inject } from '@nestjs/common'
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
import {
  Child,
  ChildrenResidenceChangeNationalRegistry,
  Override,
} from '@island.is/application/templates/family-matters-core/types'
import {
  CRCApplication,
  noChildren,
} from '@island.is/application/templates/children-residence-change'
import { S3 } from 'aws-sdk'
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
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { TemplateApiError } from '@island.is/nest/problem'

export const PRESIGNED_BUCKET = 'PRESIGNED_BUCKET'

type props = Override<
  TemplateApiModuleActionProps,
  { application: CRCApplication }
>

@Injectable()
export class ChildrenResidenceChangeService extends BaseTemplateApiService {
  s3: S3

  constructor(
    private readonly syslumennService: SyslumennService,
    @Inject(PRESIGNED_BUCKET) private readonly presignedBucket: string,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly smsService: SmsService,
    private nationalRegistryApi: NationalRegistryClientService,
  ) {
    super(ApplicationTypes.CHILDREN_RESIDENCE_CHANGE)
    this.s3 = new S3()
  }

  async nationalRegistry({
    auth,
  }: props): Promise<ChildrenResidenceChangeNationalRegistry> {
    const response = await this.nationalRegistryApi.getNationalRegistryPerson(
      auth.nationalId,
      auth,
    )

    if (!response) {
      throw new TemplateApiError(
        {
          title: 'Gögn úr þjóðskrá fundust ekki',
          summary:
            'Engin skráning úr þjóðskrá fannst á kennitölunni ' +
            auth.nationalId,
        },
        400,
      )
    }

    const childrenResponse = await this.nationalRegistryApi.getChildrenCustodyInformation(
      auth.nationalId,
      auth,
    )

    if (!childrenResponse) {
      throw new TemplateApiError(
        {
          title: noChildren.title,
          summary: noChildren.description,
        },
        400,
      )
    }

    const { fullName, nationalId, address } = response

    const children: Child[] = childrenResponse.map((child) => {
      const {
        fullName,
        nationalId,
        address,
        otherParent,
        livesWithApplicant,
        livesWithBothParents,
      } = child

      const newOtherParent = {
        address: {
          postalCode: otherParent?.address?.postalCode ?? '',
          city: otherParent?.address?.city ?? '',
          streetName: otherParent?.address?.city ?? '',
        },
        fullName: otherParent?.fullName ?? '',
        nationalId: otherParent?.nationalId ?? '',
      }

      return {
        fullName: fullName,
        nationalId: nationalId ?? '',
        address: {
          postalCode: address?.postalCode ?? '',
          city: address?.city ?? '',
          streetName: address?.city ?? '',
        },
        livesWithApplicant: livesWithApplicant ?? false,
        livesWithBothParents: livesWithBothParents ?? false,
        otherParent: newOtherParent,
      }
    })

    return {
      fullName,
      nationalId,
      address: {
        postalCode: address?.postalCode ?? '',
        city: address?.city ?? '',
        streetName: address?.city ?? '',
      },
      children,
    }
  }

  async submitApplication({ application }: props) {
    const { answers, externalData } = application
    const { nationalRegistry } = externalData
    const applicant = nationalRegistry.data
    const s3FileName = `children-residence-change/${application.id}.pdf`
    const file = await this.s3
      .getObject({ Bucket: this.presignedBucket, Key: s3FileName })
      .promise()
    const fileContent = file.Body as Buffer

    const selectedChildren = getSelectedChildrenFromExternalData(
      applicant.children,
      answers.selectedChildren,
    )

    const otherParent = selectedChildren[0].otherParent

    const childResidenceInfo = childrenResidenceInfo(
      applicant,
      answers.selectedChildren,
    )
    const currentAddress = childResidenceInfo.current.address

    if (!fileContent) {
      throw new Error('File content was undefined')
    }

    const attachments: Attachment[] = [
      {
        name: `Lögheimilisbreyting-barns-${applicant.nationalId}.pdf`,
        content: fileContent.toString('base64'),
      },
    ]

    const parentA: Person = {
      name: applicant.fullName,
      ssn: applicant.nationalId,
      phoneNumber: answers.parentA.phoneNumber,
      email: answers.parentA.email,
      homeAddress: applicant.address.streetName,
      postalCode: applicant.address.postalCode,
      city: applicant.address.city,
      signed: true,
      type: PersonType.Plaintiff,
    }

    const parentB: Person = {
      name: otherParent.fullName,
      ssn: otherParent.nationalId,
      phoneNumber: answers.parentB.phoneNumber,
      email: answers.parentB.email,
      homeAddress: otherParent.address.streetName,
      postalCode: otherParent.address.postalCode,
      city: otherParent.address.city,
      signed: true,
      type: PersonType.CounterParty,
    }

    const participants: Array<Person> = selectedChildren.map((child) => {
      return {
        name: child.fullName,
        ssn: child.nationalId,
        homeAddress: currentAddress.streetName,
        postalCode: currentAddress.postalCode,
        city: currentAddress.city,
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

    const syslumennData = syslumennDataFromPostalCode(
      childResidenceInfo.future.address.postalCode,
    )

    const uploadDataName = 'Lögheimilisbreyting barns'

    const response = await this.syslumennService
      .uploadData(participants, attachments, extraData, uploadDataName)
      .catch(async () => {
        await this.sharedTemplateAPIService.sendEmailWithAttachment(
          generateSyslumennNotificationEmail,
          (application as unknown) as Application,
          fileContent.toString('binary'),
          syslumennData.email,
        )
        return undefined
      })

    await this.sharedTemplateAPIService.sendEmail(
      (props) =>
        generateApplicationSubmittedEmail(
          props,
          fileContent.toString('binary'),
          answers.parentA.email,
          syslumennData.name,
          response?.caseNumber,
        ),
      (application as unknown) as Application,
    )

    await this.sharedTemplateAPIService.sendEmail(
      (props) =>
        generateApplicationSubmittedEmail(
          props,
          fileContent.toString('binary'),
          answers.parentB.email,
          syslumennData.name,
          response?.caseNumber,
        ),
      (application as unknown) as Application,
    )

    return response
  }

  async sendNotificationToCounterParty({ application }: props) {
    const { answers } = application
    const { counterParty } = answers

    if (counterParty.email) {
      await this.sharedTemplateAPIService.sendEmail(
        transferRequestedEmail,
        (application as unknown) as Application,
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
      (application as unknown) as Application,
    )
  }
}
