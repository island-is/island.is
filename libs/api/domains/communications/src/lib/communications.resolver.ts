import { Args, Resolver, Mutation } from '@nestjs/graphql'
import { MailService } from './mail.service'
import { ContactUsInput } from './dto/contactUs.input'
import { ContactUsPayload } from './models/contactUsPayload.model'

@Resolver()
export class CommunicationsResolver {
  constructor(private readonly mailService: MailService) {}

  @Mutation(() => ContactUsPayload)
  async contactUs(
    @Args('input') input: ContactUsInput,
  ): Promise<ContactUsPayload> {
    return {
      success: await this.mailService.deliverContactUs(input),
    }
  }
}

// TODO: Design a more dynamic solution to this
// TODO: Try to use ready made solution for this
