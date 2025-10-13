import { EmailService } from '@island.is/email-service'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { AppConfig } from './app.config'
import {
  DirectGrantPaymentFlowMetadata,
  MemorialCardPaymentFlowMetadata,
} from './types'
import { WebLandspitaliCreateMemorialCardPaymentUrlInputSendType } from '@island.is/shared/types'

@Injectable()
export class LandspitaliService {
  constructor(
    private readonly emailService: EmailService,
    @Inject(AppConfig.KEY)
    private readonly config: ConfigType<typeof AppConfig>,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private generateDirectGrantPaymentConfirmationEmailMessage(
    input: DirectGrantPaymentFlowMetadata,
  ) {
    const lines: string[] = []

    lines.push(`Styrktarsjóður: ${input.grantChargeItemCode ?? ''}`)
    lines.push(`Verkefni: ${input.project ?? ''}`)
    lines.push(`Fjárhæð: ${input.amountISK ?? ''}`)

    lines.push(`Nafn greiðanda: ${input.payerName ?? ''}`)
    lines.push(`Netfang greiðanda: ${input.payerEmail ?? ''}`)
    lines.push(`Kennitala greiðanda: ${input.payerNationalId ?? ''}`)
    lines.push(`Heimilisfang greiðanda: ${input.payerAddress ?? ''}`)
    lines.push(`Póstnúmer greiðanda: ${input.payerPostalCode ?? ''}`)
    lines.push(`Staður greiðanda: ${input.payerPlace ?? ''}`)

    lines.push(`Skýring á styrk: ${input.payerGrantExplanation ?? ''}`)

    return lines.join('\n')
  }

  async sendDirectGrantPaymentConfirmationEmail(
    input: DirectGrantPaymentFlowMetadata,
  ) {
    try {
      await this.emailService.sendEmail({
        to: this.config.landspitali.webPaymentConfirmationSendToEmail,
        from: this.config.landspitali.webPaymentConfirmationSendFromEmail,
        subject:
          this.config.landspitali.directGrantPaymentConfirmationEmailSubject,
        text: this.generateDirectGrantPaymentConfirmationEmailMessage(input),
        replyTo: input.payerEmail,
      })
      this.logger.info(
        'Sent Landspítali direct grant payment confirmation email',
      )
    } catch (error) {
      this.logger.error(
        'Failed to send Landspítali direct grant payment confirmation email',
        { message: error.message },
      )
      throw new InternalServerErrorException()
    }
  }

  private generateMemorialCardPaymentConfirmationEmailMessage(
    input: MemorialCardPaymentFlowMetadata,
  ) {
    const lines: string[] = []

    let sendType = ''
    switch (input.sendType) {
      case WebLandspitaliCreateMemorialCardPaymentUrlInputSendType.PostalMail:
        sendType = 'bréfpósti'
        break
      case WebLandspitaliCreateMemorialCardPaymentUrlInputSendType.Email:
        sendType = 'tölvupósti'
        break
    }

    lines.push(`Minningarsjóður: ${input.fundChargeItemCode ?? ''}`)
    lines.push(`Til minningar um: ${input.inMemoryOf ?? ''}`)
    lines.push(`Fjárhæð: ${input.amountISK ?? ''} krónur`)
    lines.push(`Undirskrift sendanda: ${input.senderSignature ?? ''}`)

    lines.push(`Nafn viðtakanda korts: ${input.recipientName ?? ''}`)
    lines.push(`Netfang viðtakanda korts: ${input.recipientEmail ?? ''}`)
    lines.push(`Senda kort með: ${sendType}`)
    lines.push(`Heimilisfang viðtakanda korts: ${input.recipientAddress ?? ''}`)
    lines.push(`Póstnúmer viðtakanda korts: ${input.recipientPostalCode ?? ''}`)
    lines.push(`Staður viðtakanda korts: ${input.recipientPlace ?? ''}`)

    lines.push(`Nafn greiðanda: ${input.payerName ?? ''}`)
    lines.push(`Netfang greiðanda: ${input.payerEmail ?? ''}`)
    lines.push(`Kennitala greiðanda: ${input.payerNationalId ?? ''}`)
    lines.push(`Heimilisfang greiðanda: ${input.payerAddress ?? ''}`)
    lines.push(`Póstnúmer greiðanda: ${input.payerPostalCode ?? ''}`)
    lines.push(`Staður greiðanda: ${input.payerPlace ?? ''}`)

    return lines.join('\n')
  }

  async sendMemorialCardPaymentConfirmationEmail(
    input: MemorialCardPaymentFlowMetadata,
  ) {
    try {
      await this.emailService.sendEmail({
        to: this.config.landspitali.webPaymentConfirmationSendToEmail,
        from: this.config.landspitali.webPaymentConfirmationSendFromEmail,
        subject:
          this.config.landspitali.memorialCardPaymentConfirmationEmailSubject,
        text: this.generateMemorialCardPaymentConfirmationEmailMessage(input),
        replyTo: input.payerEmail,
      })
      this.logger.info(
        'Sent Landspítali memorial card payment confirmation email',
      )
    } catch (error) {
      this.logger.error(
        'Failed to send Landspítali memorial card payment confirmation email',
        { message: error.message },
      )
      throw new InternalServerErrorException()
    }
  }
}
