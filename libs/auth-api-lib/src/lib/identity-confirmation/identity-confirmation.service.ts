import { BadRequestException, Injectable } from '@nestjs/common'
import { IdentityConfirmationInputDto } from './dto/IdentityConfirmationInput.dto'
import { InjectModel } from '@nestjs/sequelize'
import { IdentityConfirmation } from './models/Identity-Confirmation.model'
import { ZendeskService } from '@island.is/clients/zendesk'
import { uuid } from 'uuidv4'
import { IdentityConfirmationType } from './types/identity-confirmation-type'
import { SmsService } from '@island.is/nova-sms'
import { IdentityConfirmationDTO } from './dto/identity-confirmation-dto.dto'
import type { User } from '@island.is/auth-nest-tools'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { NoContentException } from '@island.is/nest/problem'
import { Op } from 'sequelize'

export const LIFE_TIME_DAYS = 28
const LIFE_TIME = LIFE_TIME_DAYS * 24 * 60 * 60 * 1000
export const EXPIRATION = 2 * LIFE_TIME

const ZENDESK_CUSTOM_FIELDS = {
  Link: 24596286118546,
}

@Injectable()
export class IdentityConfirmationService {
  constructor(
    @InjectModel(IdentityConfirmation)
    private identityConfirmationModel: typeof IdentityConfirmation,
    private readonly zendeskService: ZendeskService,
    private readonly smsService: SmsService,
    private nationalRegistryClient: NationalRegistryV3ClientService,
  ) {}

  async identityConfirmation({
    id,
    type,
    number,
  }: IdentityConfirmationInputDto): Promise<string> {
    if (type === IdentityConfirmationType.PHONE && !number) {
      throw new BadRequestException('Phone number is required')
    }

    const identityConfirmation = await this.identityConfirmationModel.create({
      id: uuid(),
      ticketId: id,
      type,
    })

    const link = this.generateLink(identityConfirmation.id)

    switch (type) {
      case IdentityConfirmationType.EMAIL:
        await this.sendViaEmail(id, link)
        break
      case IdentityConfirmationType.PHONE:
        await this.sendViaSms(number, link)
        break
      case IdentityConfirmationType.WEB_FORM:
      case IdentityConfirmationType.CHAT:
        await this.sendViaChat(id, link)
        break
      default:
        throw new Error('Invalid confirmation type')
    }

    return link
  }

  async sendViaEmail(id: string, link: string) {
    try {
      await this.zendeskService.updateTicket(id, {
        comment: {
          html_body: `Vinsamlegast opnaðu <a href="${link}">þennan hlekk</a> til að staðfesta þína auðkenningu`,
          public: true,
        },
      })
    } catch (e) {
      console.error(e)
      throw new Error('Failed to send email')
    }
  }

  async sendViaSms(phone: string | undefined, link: string) {
    if (!phone) {
      throw new Error('Cannot send sms, phone number is missing')
    }

    try {
      return this.smsService
        .sendSms(
          phone,
          `Vinsamlegast opnaðu hlekkinn til að staðfesta þína auðkenningu: ${link}`,
        )
        .then((response) => {
          return response.Code
        })
    } catch (e) {
      console.error(e)
      throw new Error('Failed to send sms')
    }
  }

  async sendViaChat(id: string, link: string) {
    try {
      await this.zendeskService.updateTicket(id, {
        // Update tickets custom field with link so it can be pushed to a Macro
        custom_fields: [
          {
            id: ZENDESK_CUSTOM_FIELDS.Link,
            value: link,
          },
        ],
      })
    } catch (e) {
      throw new Error('Failed to send chat message')
    }
  }

  private generateLink = (id: string) => {
    return `${process.env.IDENTITY_SERVER_ISSUER_URL}/app/confirm-identity/${id}`
  }

  async confirmIdentity(user: User, id: string) {
    const identityConfirmation = await this.identityConfirmationModel.findOne({
      where: {
        id,
      },
    })

    if (!identityConfirmation) {
      throw new NoContentException()
    }

    // Throw error if identity confirmation is expired
    if (
      new Date(identityConfirmation.created).getTime() + LIFE_TIME <
      Date.now()
    ) {
      throw new Error('Identity confirmation expired')
    }

    const person = await this.nationalRegistryClient.getAllDataIndividual(
      user.nationalId,
    )

    if (!person) {
      throw new BadRequestException(
        'A person with that national id could not be found',
      )
    }

    await this.zendeskService.updateTicket(identityConfirmation.ticketId, {
      comment: {
        html_body: `
          <b>Auðkenning hefur verið staðfest</b>
          <p>Umsækjandi: ${person.nafn}, kennitala: ${user.nationalId}</p>
          <p>${
            person.heimilisfang?.husHeiti
              ? 'Heimilisfang:' + person.heimilisfang.husHeiti
              : ''
          }</p>
          `,
        public: false,
      },
    })

    await identityConfirmation.destroy()
  }

  async getIdentityConfirmation(id: string): Promise<IdentityConfirmationDTO> {
    const identityConfirmation = await this.identityConfirmationModel.findOne({
      where: {
        id,
      },
    })

    if (!identityConfirmation) {
      throw new NoContentException()
    }

    return {
      id: identityConfirmation.id,
      ticketId: identityConfirmation.ticketId,
      type: identityConfirmation.type,
      // Check if time now is 2 days older than created at time
      isExpired:
        new Date(identityConfirmation.created).getTime() + LIFE_TIME <
        Date.now(),
    }
  }

  async deleteExpiredIdentityConfirmations(): Promise<number> {
    return this.identityConfirmationModel.destroy({
      where: {
        created: {
          [Op.lt]: new Date(Date.now() - EXPIRATION),
        },
      },
    })
  }
}
