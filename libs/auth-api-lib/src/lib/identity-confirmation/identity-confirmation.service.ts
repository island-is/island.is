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
import { IdentityConfirmationApiConfig } from './config'
import type { ConfigType } from '@island.is/nest/config'
import { IdentityConfirmationDTO } from './dto/IdentityConfirmationDTO.dto'

const TWO_DAYS = 2 * 24 * 60 * 60 * 1000
const ZENDESK_CUSTOM_FIELDS = {
  Email: 1,
  Phone: 2,
  Chat: 3,
  Title: 4,
  Description: 5,
  NationalId: 24433675203218,
  IdentityConfirmed: 24434086186130,
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
    @Inject(IdentityConfirmationApiConfig.KEY)
    private readonly config: ConfigType<typeof IdentityConfirmationApiConfig>,
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
        await this.sendViaEmail(email, link)
        break
      case IdentityConfirmationType.PHONE:
        await this.sendViaSms(phone, link)
        break
      case IdentityConfirmationType.CHAT:
        await this.sendViaChat(chat, link)
        break
      default:
        throw new Error('Invalid confirmation type')
    }

    return link
  }

  sendViaEmail(email: string, link: string) {
    return this.emailService.sendEmail({
      from: {
        name: this.config.email.fromName,
        address: this.config.email.fromEmail,
      },
      to: [
        {
          name: '',
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
            component: 'Copy',
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
    return `${process.env.IDENTITY_SERVER_ISSUER_URL}/app/confirm-identity/${id}`
  }

  private getCustomField = (
    ticket: Ticket,
  ): {
    phone: string
    email: string
    chat: string
    title: string
    description: string
  } => {
    if (!ticket.custom_fields) {
      throw new Error('Custom fields not found')
    }
    const phone = ticket.custom_fields.find(
      (field) => field.id === ZENDESK_CUSTOM_FIELDS.Phone,
    )

    const email = ticket.custom_fields.find(
      (field) => field.id === ZENDESK_CUSTOM_FIELDS.Email,
    )

    const chat = ticket.custom_fields.find(
      (field) => field.id === ZENDESK_CUSTOM_FIELDS.Chat,
    )

    const title = ticket.custom_fields.find(
      (field) => field.id === ZENDESK_CUSTOM_FIELDS.Title,
    )

    const description = ticket.custom_fields.find(
      (field) => field.id === ZENDESK_CUSTOM_FIELDS.Description,
    )

    return {
      phone: phone?.value ?? '',
      email: email?.value ?? '',
      chat: chat?.value ?? '',
      title: title?.value ?? '',
      description: description?.value ?? '',
    }
  }

  async confirmIdentity(id: string, nationalId: string) {
    const identityConfirmation = await this.identityConfirmationModel.findOne({
      where: {
        id,
      },
    })

    if (!identityConfirmation) {
      throw new Error('Identity confirmation not found')
    }

    // Throw error if identity is older than 2 days
    if (
      new Date(identityConfirmation.createdAt).getTime() + TWO_DAYS <
      Date.now()
    ) {
      throw new Error('Identity confirmation expired')
    }

    const updated = this.zendeskService.updateTicket(id, {
      custom_fields: [
        { id: ZENDESK_CUSTOM_FIELDS.NationalId, value: nationalId },
        { id: ZENDESK_CUSTOM_FIELDS.IdentityConfirmed, value: 'True' },
      ],
    })

    if (!updated) {
      throw new Error('Failed to update ticket')
    }

    await identityConfirmation.destroy()

    return 'Identity confirmed'
  }

  async getIdentityConfirmation(id: string): Promise<IdentityConfirmationDTO> {
    const identityConfirmation = await this.identityConfirmationModel.findOne({
      where: {
        ticketId: id,
      },
    })

    if (!identityConfirmation) {
      throw new Error('Identity confirmation not found')
    }

    const zendeskTicket = await this.zendeskService.getTicket(
      identityConfirmation.ticketId,
    )

    const { title, description } = this.getCustomField(zendeskTicket)

    return {
      id: identityConfirmation.id,
      type: identityConfirmation.type,
      title,
      description,
      // Check if time now is 2 days older than created at time
      isExpired:
        new Date(identityConfirmation.createdAt).getTime() + TWO_DAYS <
        Date.now(),
    }
  }
}
