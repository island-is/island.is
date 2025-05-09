import { Injectable } from '@nestjs/common'
import {
  SharedModuleConfig,
  TemplateApiModuleActionProps,
} from '../../../types'
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
import { generateSyslumennNotificationEmail } from './emailGenerators'
import { Application, ApplicationTypes } from '@island.is/application/types'
import { syslumennDataFromPostalCode } from './utils'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { isValidNumberForRegion } from 'libphonenumber-js'
import { generateResidenceChangePdf } from './pdfGenerators'
import { NotificationsService } from '../../../notification/notifications.service'
import { NotificationType } from '../../../notification/notificationsTemplates'
import { getSlugFromType } from '@island.is/application/core'
import { ConfigService } from '@nestjs/config'
import { getConfigValue } from '../../shared/shared.utils'

type Props = Override<
  TemplateApiModuleActionProps,
  { application: CRCApplication }
>

@Injectable()
export class ChildrenResidenceChangeServiceV2 extends BaseTemplateApiService {
  constructor(
    private readonly syslumennService: SyslumennService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService<SharedModuleConfig>,
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

    // Validate phone numbers of parents before sending to syslumenn
    if (!isValidNumberForRegion(parentA.phoneNumber ?? '', 'IS')) {
      throw new Error('Parent A phone number is not valid')
    }

    if (!isValidNumberForRegion(parentB.phoneNumber ?? '', 'IS')) {
      throw new Error('Parent B phone number is not valid')
    }

    const syslumennData = syslumennDataFromPostalCode(
      childResidenceInfo.future?.address?.postalCode ?? '101',
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
    const {
      externalData: { nationalRegistry, childrenCustodyInformation },
    } = application

    if (
      !childrenCustodyInformation?.data ||
      childrenCustodyInformation.data.length === 0
    ) {
      throw new Error('No custody information available')
    }

    const applicant = nationalRegistry.data
    const otherParent = childrenCustodyInformation.data[0].otherParent
    const contractLink = await this.getApplicationLink(application)

    if (otherParent) {
      await this.notificationsService.sendNotification({
        type: NotificationType.AssignCounterParty,
        messageParties: {
          recipient: otherParent.nationalId,
          sender: applicant.nationalId,
        },
        applicationId: application.id,
        args: {
          applicantName: applicant.fullName,
          contractLink,
        },
      })
    }
  }

  // Sends notification to both parties
  async approvedByOrganization({ application }: Props) {
    const {
      externalData: {
        nationalRegistry,
        childrenCustodyInformation,
        submitApplication,
      },
    } = application
    if (
      !childrenCustodyInformation?.data ||
      childrenCustodyInformation.data.length === 0
    ) {
      throw new Error('No custody information available')
    }
    const applicant = nationalRegistry.data
    const otherParent = childrenCustodyInformation.data[0].otherParent
    const caseNumber = submitApplication?.data?.caseNumber
    const applicationLink = await this.getApplicationLink(application)

    if (!otherParent) {
      throw new Error('Other parent was undefined')
    }

    await Promise.all([
      this.notificationsService.sendNotification({
        type: NotificationType.ChildrenResidenceChangeApprovedByOrg,
        messageParties: {
          recipient: applicant.nationalId,
        },
        applicationId: application.id,
        args: {
          applicationLink,
          caseNumber: caseNumber || '',
        },
      }),
      this.notificationsService.sendNotification({
        type: NotificationType.ChildrenResidenceChangeApprovedByOrg,
        messageParties: {
          recipient: otherParent.nationalId,
        },
        applicationId: application.id,
        args: {
          applicationLink,
          caseNumber: caseNumber || '',
        },
      }),
    ])
  }

  async rejectedByCounterParty({ application }: Props) {
    const {
      externalData: { nationalRegistry, childrenCustodyInformation },
    } = application
    if (
      !childrenCustodyInformation?.data ||
      childrenCustodyInformation.data.length === 0
    ) {
      throw new Error('No custody information available')
    }
    const applicant = nationalRegistry.data
    const otherParent = childrenCustodyInformation.data[0].otherParent

    await this.notificationsService.sendNotification({
      type: NotificationType.RejectedByCounterParty,
      messageParties: {
        recipient: applicant.nationalId,
      },
      applicationId: application.id,
      args: {
        counterPartyName: otherParent?.fullName || '',
      },
    })
  }

  async rejectedByOrganization({ application }: Props) {
    const {
      answers,
      externalData: { nationalRegistry, childrenCustodyInformation },
    } = application
    if (
      !childrenCustodyInformation?.data ||
      childrenCustodyInformation.data.length === 0
    ) {
      throw new Error('No custody information available')
    }
    const applicant = nationalRegistry.data
    const otherParent = childrenCustodyInformation.data[0].otherParent
    const childResidenceInfo = childrenResidenceInfo(
      applicant,
      childrenCustodyInformation.data,
      answers.selectedChildren,
    )
    const syslumennName = syslumennDataFromPostalCode(
      childResidenceInfo?.future?.address?.postalCode || '',
    ).name

    if (!otherParent) {
      throw new Error('Other parent was undefined')
    }

    await Promise.all([
      this.notificationsService.sendNotification({
        type: NotificationType.RejectedByOrganization,
        messageParties: {
          recipient: applicant.nationalId,
        },
        applicationId: application.id,
        args: {
          orgName: syslumennName,
        },
      }),
      this.notificationsService.sendNotification({
        type: NotificationType.RejectedByOrganization,
        messageParties: {
          recipient: otherParent.nationalId,
        },
        applicationId: application.id,
        args: {
          orgName: syslumennName,
        },
      }),
    ])
  }

  private async getApplicationLink(application: CRCApplication) {
    const clientLocationOrigin = getConfigValue(
      this.configService,
      'clientLocationOrigin',
    ) as string

    return `${clientLocationOrigin}/${
      getSlugFromType(application.typeId) as string
    }/${application.id}` as string
  }
}
