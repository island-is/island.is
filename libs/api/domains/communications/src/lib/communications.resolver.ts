import { Args, Mutation,Resolver } from '@nestjs/graphql'

import { ContactUsInput } from './dto/contactUs.input'
import { ServiceWebFormsInput } from './dto/serviceWebForms.input'
import { TellUsAStoryInput } from './dto/tellUsAStory.input'
import { CommunicationResponse } from './models/communicationResponse.model'
import { CommunicationsService } from './communications.service'

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
    const inputWithInstitutionEmail = await this.communicationsService.getInputWithInstitutionEmail(
      input,
    )
    await this.communicationsService.sendEmail(inputWithInstitutionEmail)
    return {
      sent: true,
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
