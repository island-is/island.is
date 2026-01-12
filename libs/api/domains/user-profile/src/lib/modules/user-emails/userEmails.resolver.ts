import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
  type User,
} from '@island.is/auth-nest-tools'

import { EmailsDto } from '@island.is/clients/user-profile'
import { AddEmailInput } from '../../dto/addEmail.input'
import { DeleteEmailInput } from '../../dto/deleteEmail.input'
import { SetPrimaryEmailInput } from '../../dto/setPrimaryEmail.input'
import { AddEmail } from '../../models/addEmail.model'
import { UserEmailsService } from './userEmails.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class UserEmailsResolver {
  constructor(private userEmailsService: UserEmailsService) {}

  @Mutation(() => AddEmail, {
    name: 'userEmailsAddEmail',
  })
  async addEmail(
    @CurrentUser() user: User,
    @Args('input') input: AddEmailInput,
  ): Promise<EmailsDto> {
    return this.userEmailsService.addEmail({
      user,
      input,
    })
  }

  @Mutation(() => Boolean, {
    name: 'userEmailsSetPrimaryEmail',
  })
  async setPrimaryEmail(
    @CurrentUser() user: User,
    @Args('input') { emailId }: SetPrimaryEmailInput,
  ): Promise<boolean> {
    return this.userEmailsService.setPrimaryEmail({
      user,
      emailId,
    })
  }

  @Mutation(() => Boolean, {
    name: 'userEmailsDeleteEmail',
  })
  async deleteEmail(
    @CurrentUser() user: User,
    @Args('input') { emailId }: DeleteEmailInput,
  ): Promise<boolean> {
    return this.userEmailsService.deleteEmail({
      user,
      emailId,
    })
  }
}
