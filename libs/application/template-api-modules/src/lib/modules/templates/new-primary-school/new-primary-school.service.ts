import { getSlugFromType } from '@island.is/application/core'
import {
  errorMessages,
  FIRST_GRADE_AGE,
  getApplicationAnswers,
  getApplicationExternalData,
  getOtherGuardian,
  needsOtherGuardianApproval,
  needsPayerApproval,
  TENTH_GRADE_AGE,
} from '@island.is/application/templates/new-primary-school'
import {
  ApplicationTypes,
  ApplicationWithAttachments,
  ChildrenCustodyInformationParameters,
} from '@island.is/application/types'
import {
  FriggClientService,
  GetOrganizationsByTypeTypeEnum,
} from '@island.is/clients/mms/frigg'
import { S3Service } from '@island.is/nest/aws'
import { TemplateApiError } from '@island.is/nest/problem'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as kennitala from 'kennitala'
import { format as formatKennitala } from 'kennitala'
import { NotificationsService } from '../../../notification/notifications.service'
import { NotificationType } from '../../../notification/notificationsTemplates'
import {
  SharedModuleConfig,
  TemplateApiModuleActionProps,
} from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { getConfigValue } from '../../shared/shared.utils'
import { transformApplicationToNewPrimarySchoolDTO } from './new-primary-school.utils'
import { NationalRegistryV3Service } from '../../shared/api/national-registry-v3/national-registry-v3.service'

@Injectable()
export class NewPrimarySchoolService extends BaseTemplateApiService {
  constructor(
    private readonly friggClientService: FriggClientService,
    private readonly nationalRegistryV3Service: NationalRegistryV3Service,
    private readonly s3Service: S3Service,
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService<SharedModuleConfig>,
  ) {
    super(ApplicationTypes.NEW_PRIMARY_SCHOOL)
  }

  async getChildInformation({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const { childNationalId } = getApplicationAnswers(application.answers)

    if (!childNationalId) return undefined

    return await this.friggClientService.getUserById(auth, childNationalId)
  }

  async getChildren({ auth }: TemplateApiModuleActionProps) {
    const currentYear = new Date().getFullYear()
    const firstGradeYear = currentYear - FIRST_GRADE_AGE
    const tenthGradeYear = currentYear - TENTH_GRADE_AGE

    const children =
      await this.nationalRegistryV3Service.childrenCustodyInformation({
        auth,
        params: undefined,
      } as TemplateApiModuleActionProps<ChildrenCustodyInformationParameters>)

    // Check if the child is at primary school age and lives with the applicant
    const filteredChildren = children.filter((child) => {
      // Allow test children to pass through
      const validChildren = [
        '1111111119',
        '2222222229',
        '5555555559',
        '6666666669',
      ]
      if (
        (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) &&
        validChildren.includes(child.nationalId)
      ) {
        return true
      }

      if (!child.nationalId) {
        return false
      }

      const yearOfBirth = kennitala
        .info(child.nationalId)
        .birthday.getFullYear()

      return (
        child.livesWithApplicant &&
        yearOfBirth >= tenthGradeYear &&
        yearOfBirth <= firstGradeYear
      )
    })

    if (filteredChildren.length === 0) {
      throw new TemplateApiError(
        {
          title: errorMessages.noChildrenFoundTitle,
          summary: errorMessages.noChildrenFoundMessage,
        },
        400,
      )
    }

    return filteredChildren
  }

  async getPreferredSchool({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const { childNationalId } = getApplicationAnswers(application.answers)

    if (!childNationalId) return undefined

    return await this.friggClientService.getPreferredSchool(
      auth,
      childNationalId,
    )
  }

  async getSchools({ auth }: TemplateApiModuleActionProps) {
    return await this.friggClientService.getOrganizationsByType(auth, {
      type: GetOrganizationsByTypeTypeEnum.School,
    })
  }

  async getAttachmentsAsBase64(
    application: TemplateApiModuleActionProps['application'],
  ): Promise<string[]> {
    const { attachmentsFiles } = getApplicationAnswers(application.answers)
    const attachmentDict = application.attachments as {
      [key: string]: string
    }

    const attachments = await Promise.all(
      attachmentsFiles?.map(async (a) => {
        const filename = attachmentDict[a.key]

        if (!filename) {
          throw new Error(
            `Attachment file not found in attachmentDict for key: ${a.key}`,
          )
        }

        const fileContent = await this.s3Service.getFileContent(
          filename,
          'base64',
        )

        if (!fileContent) {
          throw new Error(
            `File content not found in S3 for key: ${a.key}, filename: ${filename}`,
          )
        }

        return fileContent
      }) || [],
    )

    return attachments
  }

  async sendApplication({ auth, application }: TemplateApiModuleActionProps) {
    const attachments = await this.getAttachmentsAsBase64(application)

    const newPrimarySchoolDTO = transformApplicationToNewPrimarySchoolDTO(
      application,
      attachments,
    )

    const response = await this.friggClientService.sendApplication(
      auth,
      newPrimarySchoolDTO,
    )

    if (needsOtherGuardianApproval(application)) {
      await this.sendHnippNotificationToApplicant({
        application,
        type: NotificationType.NewPrimarySchoolOtherGuardianApproved,
      })
    }

    if (needsPayerApproval(application)) {
      await this.sendHnippNotificationToApplicant({
        application,
        type: NotificationType.NewPrimarySchoolPayerApproved,
      })
    }

    return response
  }

  async assignOtherGuardian({ application }: TemplateApiModuleActionProps) {
    const otherGuardian = getOtherGuardian(
      application.answers,
      application.externalData,
    )

    await this.sendHnippNotificationToAssignee({
      application,
      type: NotificationType.NewPrimarySchoolAssignOtherGuardian,
      recipient: otherGuardian?.nationalId,
    })
  }

  async notifyApplicantOfRejectionFromOtherGuardian({
    application,
  }: TemplateApiModuleActionProps) {
    await this.sendHnippNotificationToApplicant({
      application,
      type: NotificationType.NewPrimarySchoolOtherGuardianRejected,
    })
  }

  async assignPayer({ application }: TemplateApiModuleActionProps) {
    const { payerNationalId } = getApplicationAnswers(application.answers)

    await this.sendHnippNotificationToAssignee({
      application,
      type: NotificationType.NewPrimarySchoolAssignPayer,
      recipient: payerNationalId,
    })
  }

  async notifyApplicantOfRejectionFromPayer({
    application,
  }: TemplateApiModuleActionProps) {
    await this.sendHnippNotificationToApplicant({
      application,
      type: NotificationType.NewPrimarySchoolPayerRejected,
    })
  }

  private async sendHnippNotificationToApplicant({
    application,
    type,
  }: {
    application: ApplicationWithAttachments
    type: NotificationType
  }) {
    const { applicantNationalId } = getApplicationExternalData(
      application.externalData,
    )
    const applicationLink = await this.getApplicationLink(application)

    if (!applicantNationalId)
      throw new Error('Could not find applicant national id')

    await this.notificationsService.sendNotification({
      type,
      messageParties: { recipient: applicantNationalId },
      applicationId: application.id,
      args: { applicationLink },
    })
  }

  private async sendHnippNotificationToAssignee({
    application,
    type,
    recipient,
  }: {
    application: ApplicationWithAttachments
    type: NotificationType
    recipient?: string
  }) {
    const { applicantName, applicantNationalId } = getApplicationExternalData(
      application.externalData,
    )
    const applicationLink = await this.getApplicationLink(application)

    if (!recipient) throw new Error('Could not find recipient')
    if (!applicantName) throw new Error('Could not find applicant name')
    if (!applicantNationalId)
      throw new Error('Could not find applicant national id')

    await this.notificationsService.sendNotification({
      type,
      messageParties: {
        recipient,
        sender: applicantNationalId,
      },
      applicationId: application.id,
      args: {
        name: applicantName,
        id: formatKennitala(applicantNationalId),
        applicationLink,
      },
    })
  }

  private async getApplicationLink(application: ApplicationWithAttachments) {
    const clientLocationOrigin = getConfigValue(
      this.configService,
      'clientLocationOrigin',
    ) as string

    return `${clientLocationOrigin}/${
      getSlugFromType(application.typeId) as string
    }/${application.id}` as string
  }
}
