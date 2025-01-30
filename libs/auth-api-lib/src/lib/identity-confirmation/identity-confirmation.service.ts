import { Inject, Injectable } from '@nestjs/common'
import { IdentityConfirmationInputDto } from './dto/IdentityConfirmationInput.dto'
import { InjectModel } from '@nestjs/sequelize'
import { IdentityConfirmation } from './models/Identity-Confirmation.model'
import { Ticket, ZendeskService } from '@island.is/clients/zendesk'
import { uuid } from 'uuidv4'
import { IdentityConfirmationType } from './types/identity-confirmation-type'
import { SmsService } from '@island.is/nova-sms'
import { EmailService } from '@island.is/email-service'
import { join } from 'path'

const ZENDESK_CUSTOM_FIELDS = {
  Email: 21401464004498,
  Phone: 21401435545234,
  Chat: 21683921674002,
}

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

    const { phone, email, chat } = this.getCustomField(zendeskCase)

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
        await this.sendViaEmail('gunnlaugur@aranja.com', link)
        break
      case IdentityConfirmationType.PHONE:
        await this.sendViaSms('6916391', link)
        break
      case IdentityConfirmationType.CHAT:
        await this.sendViaChat(id, link)
        break
      default:
        throw new Error('Invalid confirmation type')
    }

    return link
  }

  sendViaEmail(email: string, link: string) {
    return this.emailService.sendEmail({
      from: {
        // TODO Set as config
        name: 'island.is',
        address: 'noreply@island.is',
      },
      replyTo: {
        // TODO Set as config
        name: 'island.is',
        address: 'noreply@island.is',
      },
      to: [
        {
          name: 'Gunnlaugur',
          address: email,
        },
      ],
      subject: 'Staðfesting á auðkenningu',
      template: {
        title: 'Staðfesting á auðkenningu',
        body: [
          {
            component: 'Image',
            context: {
              src: join(__dirname, `./assets/images/logois.jpg`),
              alt: 'Ísland.is logo',
            },
          },
          {
            component: 'Heading',
            context: {
              copy: 'Staðfesting á auðkenningu',
              small: true,
            },
          },
          {
            component: 'Heading',
            context: {
              copy: 'Vinasamlegast ýttu hér til að staðfesta auðkenningu',
              small: true,
            },
          },
          {
            component: 'Button',
            context: {
              copy: 'Opna staðfestingarsíðu',
              href: link,
            },
          },
        ],
      },
    })
  }

  sendViaSms(phoneNumber: string, link: string) {
    try {
      return this.smsService
        .sendSms(phoneNumber, `Vinsamlegast opnaðu þetta: ${link}`)
        .then((response) => {
          return response.Code
        })
    } catch (e) {
      console.error(e)
      throw new Error('Failed to send sms')
    }
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

  private getCustomField = (
    ticket: Ticket,
  ): { phone: string; email: string; chat: string } => {
    const phone = ticket.custom_fields.find(
      (field) => field.id === ZENDESK_CUSTOM_FIELDS.Phone,
    )

    const email = ticket.custom_fields.find(
      (field) => field.id === ZENDESK_CUSTOM_FIELDS.Email,
    )

    const chat = ticket.custom_fields.find(
      (field) => field.id === ZENDESK_CUSTOM_FIELDS.Chat,
    )

    return {
      phone: phone?.value ?? '',
      email: email?.value ?? '',
      chat: chat?.value ?? '',
    }
  }
}
