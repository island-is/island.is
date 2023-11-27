import { Args, Resolver, Mutation } from '@nestjs/graphql'
import { CommunicationsService } from './communications.service'
import { ContactUsInput } from './dto/contactUs.input'
import { TellUsAStoryInput } from './dto/tellUsAStory.input'
import { ServiceWebFormsInput } from './dto/serviceWebForms.input'

import { CommunicationResponse } from './models/communicationResponse.model'
import { GenericFormInput } from './dto/genericForm.input'

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
  async genericForm(
    @Args('input') input: GenericFormInput,
  ): Promise<CommunicationResponse> {
    const result = await this.communicationsService.sendFormResponse(input)
    return {
      sent: result,
    }
  }

  @Mutation(() => CommunicationResponse)
  async serviceWebForms(
    @Args('input') input: ServiceWebFormsInput,
  ): Promise<CommunicationResponse> {
    const inputWithInstitutionEmail =
      await this.communicationsService.getInputWithInstitutionEmail(input)
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
