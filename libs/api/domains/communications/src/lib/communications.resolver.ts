import { Args, Resolver, Mutation } from '@nestjs/graphql'
import { ContentfulRepository, localeMap } from '@island.is/cms'
import { CommunicationsService } from './communications.service'
import { ContactUsInput } from './dto/contactUs.input'
import { TellUsAStoryInput } from './dto/tellUsAStory.input'
import {
  ServiceWebFormsInput,
  ServiceWebFormsInputWithToAddress,
} from './dto/serviceWebForms.input'

import { CommunicationResponse } from './models/communicationResponse.model'

@Resolver()
export class CommunicationsResolver {
  constructor(private readonly communicationsService: CommunicationsService) {}

  @Mutation(() => CommunicationResponse)
  async contactUs(
    @Args('input') input: ContactUsInput,
  ): Promise<CommunicationResponse> {
    await this.communicationsService.sendEmail(input)
    return {
      sent: true,
    }
  }

  @Mutation(() => CommunicationResponse)
  async tellUsAStory(
    @Args('input') input: TellUsAStoryInput,
  ): Promise<CommunicationResponse> {
    await this.communicationsService.sendEmail(input)
    return {
      sent: true,
    }
  }

  @Mutation(() => CommunicationResponse)
  async serviceWebForms(
    @Args('input') input: ServiceWebFormsInput,
  ): Promise<CommunicationResponse> {
    const isSent = (sent = true) => ({
      sent,
    })

    try {
      const contentfulRespository = new ContentfulRepository()

      const result = await contentfulRespository.getLocalizedEntries(
        localeMap['is'],
        {
          ['content_type']: 'organization',
          'fields.slug': input.institutionSlug,
        },
      )

      const item = result?.total > 0 ? result?.items[0] : null
      const email = (item?.fields as { email?: string }).email

      const inputWithToAddress: ServiceWebFormsInputWithToAddress = {
        ...input,
        to: email,
      }

      await this.communicationsService.sendEmail(inputWithToAddress)
      return isSent()
    } catch (e) {
      return isSent(false)
    }
  }

  @Mutation(() => CommunicationResponse)
  async contactUsZendeskTicket(
    @Args('input') input: ContactUsInput,
  ): Promise<CommunicationResponse> {
    await this.communicationsService.sendZendeskTicket(input)
    return {
      sent: true,
    }
  }
}
