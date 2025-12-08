import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../../types'
import { TemplateApiError } from '@island.is/nest/problem'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { SharedTemplateApiService } from '../../../shared'

type ApplicationAnswers = {
  participantNationalIdAndName: {
    nationalId: string
    name: string
    email: string
    phone: string
  }
  payerNationalId: string
  payerName: string
}

@Injectable()
export class CoursesService extends BaseTemplateApiService {
  private readonly config = {
    confirmationSendToEmail: process.env.HH_COURSES_CONFIRMATION_SEND_TO_EMAIL,
    confirmationEmailSubject: process.env.HH_COURSES_CONFIRMATION_EMAIL_SUBJECT,
  } // TODO: Implement
  constructor(
    private readonly sharedTemplateApiService: SharedTemplateApiService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    super(ApplicationTypes.HH_COURSES)
  }

  async submitApplication({
    application,
  }: TemplateApiModuleActionProps): Promise<{ success: boolean }> {
    try {
      const answers = application.answers as ApplicationAnswers

      await this.sharedTemplateApiService.sendEmail(
        (props) => {
          return {
            from: {
              name: props.options.email.sender,
              address: props.options.email.address,
            },
            to: this.config.confirmationSendToEmail,
            subject: this.config.confirmationEmailSubject,
            text: this.formatApplicationMessage(answers),
            replyTo: answers.participantNationalIdAndName.email,
          }
        },
        application,
        'is',
      )

      return { success: true }
    } catch (error) {
      this.logger.error('Failed to submit HH courses application to Zendesk', {
        applicationId: application.id,
        error: error.message,
      })

      if (error instanceof TemplateApiError) {
        throw error
      }

      throw new TemplateApiError(
        {
          title: 'Failed to submit application',
          summary: error.message || 'An unexpected error occurred',
        },
        500,
      )
    }
  }

  private formatApplicationMessage(answers: ApplicationAnswers): string {
    const participant = answers.participantNationalIdAndName
    const payerNationalId = answers.payerNationalId
    const payerName = answers.payerName

    let message = '' // TODO: Add information about course and date
    message += `Nafn þátttakanda: ${participant.name}\n`
    message += `Kennitala þátttakanda: ${participant.nationalId}\n`
    message += `Netfang þátttakanda: ${participant.email}\n`
    message += `Símanúmer þátttakanda: ${participant.phone}\n\n`

    message += `Nafn greiðanda: ${payerName}\n`
    message += `Kennitala greiðanda: ${payerNationalId}\n`

    return message
  }
}
