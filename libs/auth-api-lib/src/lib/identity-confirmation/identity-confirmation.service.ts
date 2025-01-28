import { Inject, Injectable } from '@nestjs/common'
import { IdentityConfirmationInputDto } from './dto/IdentityConfirmationInput.dto'
import { InjectModel } from '@nestjs/sequelize'
import { IdentityConfirmation } from './models/Identity-Confirmation.model'
import { ZendeskService } from '@island.is/clients/zendesk'
import { uuid } from 'uuidv4'
import { IdentityConfirmationType } from './types/identity-confirmation-type'
import { SmsService } from '@island.is/nova-sms'
import { EmailService } from '@island.is/email-service'

@Injectable()
export class IdentityConfirmationService {
  constructor(
    @InjectModel(IdentityConfirmation)
    private identityConfirmationModel: typeof IdentityConfirmation,
    private readonly zendeskService: ZendeskService,
    private readonly smsService: SmsService,
    @Inject(EmailService)
    private readonly emailService: EmailService,
  ) {}

  async identityConfirmation({
    id,
    type,
  }: IdentityConfirmationInputDto): Promise<string> {
    const zendeskCase = await this.zendeskService.getTicket(id)

    if (!zendeskCase) {
      throw new Error('Ticket not found')
    }

    const identityConfirmation = await this.identityConfirmationModel.create({
      id: uuid(),
      ticketId: id,
      type,
    })

    const link = this.generateLink(identityConfirmation.id)

    switch (type) {
      case IdentityConfirmationType.EMAIL:
        await this.sendViaEmail(link)
        break
      case IdentityConfirmationType.PHONE:
        await this.sendViaSms(link)
        break
      case IdentityConfirmationType.WEB:
        await this.sendViaChat(id, link)
        break
      default:
        throw new Error('Invalid confirmation type')
    }

    return link
  }

  async sendViaEmail(link: string) {
    // Send email
  }

  async sendViaSms(link: string) {
    // Send SMS
  }

  async sendViaChat(id: string, link: string) {
    await this.zendeskService.sendToLiveChat(
      id,
      `Vinsalmlegast opnaðu þetta: ${link}`,
    )
  }

  private generateLink = (id: string) => {
    return `${process.env.IDENTITY_SERVER_ISSUER_URL}/confirmation/${id}`
  }
}
