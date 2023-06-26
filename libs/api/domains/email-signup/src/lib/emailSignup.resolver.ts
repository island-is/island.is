import { Injectable } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { EmailSignupInput } from './dto/emailSignup.input'
import { EmailSignupResponse } from './models/emailSignupResponse.model'
import { EmailSignupService } from './emailSignup.service'

@Resolver()
@Injectable()
export class EmailSignupResolver {
  constructor(private readonly emailSignupService: EmailSignupService) {}

  @Mutation(() => EmailSignupResponse)
  async emailSignupSubscription(
    @Args('input') input: EmailSignupInput,
  ): Promise<EmailSignupResponse> {
    return this.emailSignupService.subscribeToMailingList(input)
  }
}
