import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { CodeOwners } from '@island.is/shared/constants'
import type { Locale } from '@island.is/shared/types'
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CodeOwner } from '@island.is/nest/core'
import { Application, ApplicationPayment } from './application.model'

import { ApplicationService } from './application.service'
import { AddAttachmentInput } from './dto/addAttachment.input'
import { ApplicationApplicationInput } from './dto/applicationApplication.input'
import { ApplicationApplicationsInput } from './dto/applicationApplications.input'
import { AssignApplicationInput } from './dto/assignApplication.input'
import { AttachmentPresignedUrlInput } from './dto/AttachmentPresignedUrl.input'
import { CreateApplicationInput } from './dto/createApplication.input'
import { DeleteApplicationInput } from './dto/deleteApplication.input'
import { DeleteAttachmentInput } from './dto/deleteAttachment.input'
import { PresignedUrlResponse } from './dto/presignedUrl.response'
import { SubmitApplicationInput } from './dto/submitApplication.input'
import { UpdateApplicationInput } from './dto/updateApplication.input'
import { UpdateApplicationExternalDataInput } from './dto/updateApplicationExternalData.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@CodeOwner(CodeOwners.NordaApplications)
@Resolver(() => Application)
export class ApplicationResolver {
  constructor(private applicationService: ApplicationService) {}

  @Query(() => Application, { nullable: true })
  async applicationApplication(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: ApplicationApplicationInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.findOne(input.id, user, locale)
  }

  @Query(() => ApplicationPayment, { nullable: true })
  async applicationPaymentStatus(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('applicationId') applicationId: string,
  ): Promise<ApplicationPayment | null> {
    const { fulfilled, paymentUrl } =
      await this.applicationService.getPaymentStatus(
        applicationId,
        user,
        locale,
      )
    return {
      fulfilled,
      paymentUrl,
    }
  }

  @Query(() => [Application], { nullable: true })
  async applicationApplications(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input', { nullable: true }) input?: ApplicationApplicationsInput,
  ): Promise<Application[] | null> {
    return this.applicationService.findAll(user, locale, input)
  }

  @Mutation(() => Application, { nullable: true })
  async createApplication(
    @Args('locale', { type: () => String, nullable: true })
    _locale: Locale = 'is',
    @Args('input') input: CreateApplicationInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.create(input, user)
  }

  @Mutation(() => Application, { nullable: true })
  async updateApplication(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: UpdateApplicationInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.update(input, user, locale)
  }

  @Mutation(() => Application, { nullable: true })
  async updateApplicationExternalData(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: UpdateApplicationExternalDataInput,
    @CurrentUser() user: User,
  ): Promise<Application | void> {
    return await this.applicationService.updateExternalData(input, user, locale)
  }

  @Mutation(() => Application, { nullable: true })
  async addAttachment(
    @Args('input') input: AddAttachmentInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.addAttachment(input, user)
  }

  @Mutation(() => Application, { nullable: true })
  async deleteAttachment(
    @Args('input') input: DeleteAttachmentInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.deleteAttachment(input, user)
  }

  @Mutation(() => Application, { nullable: true })
  async submitApplication(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: SubmitApplicationInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.submitApplication(input, user, locale)
  }

  @Mutation(() => Application, { nullable: true })
  async assignApplication(
    @Args('input') input: AssignApplicationInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.assignApplication(input, user)
  }

  @Query(() => PresignedUrlResponse, { nullable: true })
  attachmentPresignedURL(
    @Args('input') input: AttachmentPresignedUrlInput,
    @CurrentUser() user: User,
  ): Promise<PresignedUrlResponse> {
    return this.applicationService.attachmentPresignedURL(input, user)
  }

  @Mutation(() => Application, { nullable: true })
  async deleteApplication(
    @Args('input') input: DeleteApplicationInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.applicationService.deleteApplication(input, user)
  }
}
