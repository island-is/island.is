import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { MailchimpSubscribeResponse } from './models/mailchimpSubscribeResponse.model'
import { MailchimpSubscribeInput } from './dto/mailchimpSubscribe.input'
import axios from 'axios'
import { CmsContentfulService } from '@island.is/cms'
import { Injectable } from '@nestjs/common'

@Resolver()
@Injectable()
export class MailchimpResolver {
  constructor(private readonly cmsContentfulService: CmsContentfulService) {}

  @Mutation(() => MailchimpSubscribeResponse)
  async mailchimpSubscribe(
    @Args('input') input: MailchimpSubscribeInput,
  ): Promise<MailchimpSubscribeResponse> {
    const url =
      (
        await this.cmsContentfulService.getMailingListSignupSlice({
          id: input.signupID,
        })
      )?.signupUrl ?? ''

    if (!url.includes('{{EMAIL}}')) {
      return {
        subscribed: false,
      }
    }

    return axios
      .get(
        url
          .replace('{{EMAIL}}', input.email)
          .replace('{{NAME}}', input.name ?? '')
          .replace('{{TOGGLE}}', input.toggle ? 'Yes' : 'No'),
      )
      .then((response) => ({
        subscribed: true,
      }))
      .catch((err) => ({
        subscribed: false,
      }))
  }
}
