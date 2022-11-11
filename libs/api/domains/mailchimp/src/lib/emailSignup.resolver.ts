import axios from 'axios'
import { Injectable } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { CmsContentfulService } from '@island.is/cms'

import { EmailSignupInput } from './dto/emailSignup.input'
import { EmailSignupResponse } from './models/emailSignupResponse.model'

@Resolver()
@Injectable()
export class EmailSignupResolver {
  constructor(private readonly cmsContentfulService: CmsContentfulService) {}

  @Mutation(() => EmailSignupResponse)
  async emailSignupSubscription(
    @Args('input') input: EmailSignupInput,
  ): Promise<EmailSignupResponse> {
    const emailSignupModel = await this.cmsContentfulService.getEmailSignup({
      id: input.signupID,
    })

    if (!emailSignupModel) return { subscribed: false }

    const url = (emailSignupModel?.configuration?.signupUrl as string) ?? ''

    if (!url.includes('{{EMAIL}}')) {
      return {
        subscribed: false,
      }
    }

    const selectedCategories = mailingListSignupSlice?.categories
      ? (JSON.parse(
          mailingListSignupSlice?.categories,
        ) as Category[]).filter((category, idx) =>
          input.categories?.includes(idx),
        )
      : []

    const inputFieldNames = input.inputFields?.map((i) => i?.name)

    const parsedInputs = JSON.parse(
      mailingListSignupSlice?.inputs ?? '[]',
    ) as typeof input['inputFields']

    const selectedInputs = (parsedInputs ?? []).filter((i) =>
      inputFieldNames?.includes(i?.name),
    )

    const populatedUrl = url
      .replace('{{EMAIL}}', input.email)
      .replace('{{NAME}}', input.name ?? '')
      .replace('{{TOGGLE}}', input.toggle ? 'Yes' : 'No')
      .replace(
        '{{CATEGORIES}}',
        selectedCategories.map((category) => `${category.name}=1`).join('&'),
      )
      .replace('{{FNAME}}', input.name?.split(' ')?.[0] ?? '')
      .replace('{{LNAME}}', input.name?.split(' ')?.slice(1)?.join(' ') ?? ' ')
      .replace(
        '{{INPUTS}}',
        selectedInputs.map((i) => `${i.name}=${i.value}`).join('&'),
      )

    console.log(populatedUrl)

    return axios
      .get(populatedUrl)
      .then((response) => {
        console.log(response.data)
        return {
          subscribed: true,
        }
      })
      .catch((err) => ({
        subscribed: false,
      }))
  }
}
