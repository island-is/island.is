import { Args, Query, Resolver, Mutation } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import type { Locale } from '@island.is/shared/types'

import { ApplicationService } from './application.service'
import { Application, ApplicationPayment } from './application.model'
import { CreateApplicationInput } from './dto/createApplication.input'
import { UpdateApplicationInput } from './dto/updateApplication.input'
import { UpdateApplicationExternalDataInput } from './dto/updateApplicationExternalData.input'
import { AddAttachmentInput } from './dto/addAttachment.input'
import { DeleteAttachmentInput } from './dto/deleteAttachment.input'
import { SubmitApplicationInput } from './dto/submitApplication.input'
import { AssignApplicationInput } from './dto/assignApplication.input'
import { GeneratePdfInput } from './dto/generatePdf.input'
import { RequestFileSignatureInput } from './dto/requestFileSignature.input'
import { UploadSignedFileInput } from './dto/uploadSignedFile.input'
import { GetPresignedUrlInput } from './dto/getPresignedUrl.input'
import { ApplicationApplicationInput } from './dto/applicationApplication.input'
import { ApplicationApplicationsInput } from './dto/applicationApplications.input'
import { RequestFileSignatureResponse } from './dto/requestFileSignature.response'
import { PresignedUrlResponse } from './dto/presignedUrl.response'
import { UploadSignedFileResponse } from './dto/uploadSignedFile.response'
import { AttachmentPresignedUrlInput } from './dto/AttachmentPresignedUrl.input'
import { DeleteApplicationInput } from './dto/deleteApplication.input'

@UseGuards(IdsUserGuard, ScopesGuard)
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
    @Args('input') input: SubmitApplicationInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.submitApplication(input, user)
  }

  @Mutation(() => Application, { nullable: true })
  async assignApplication(
    @Args('input') input: AssignApplicationInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.assignApplication(input, user)
  }

  @Mutation(() => PresignedUrlResponse, { nullable: true })
  async generatePdfPresignedUrl(
    @Args('input') input: GeneratePdfInput,
    @CurrentUser() user: User,
  ): Promise<PresignedUrlResponse> {
    return this.applicationService.generatePdfPresignedUrl(input, user)
  }

  @Mutation(() => RequestFileSignatureResponse, { nullable: true })
  requestFileSignature(
    @Args('input') input: RequestFileSignatureInput,
    @CurrentUser() user: User,
  ): Promise<RequestFileSignatureResponse> {
    return this.applicationService.requestFileSignature(input, user)
  }

  @Mutation(() => UploadSignedFileResponse, { nullable: true })
  uploadSignedFile(
    @Args('input') input: UploadSignedFileInput,
    @CurrentUser() user: User,
  ): Promise<UploadSignedFileResponse> {
    return this.applicationService.uploadSignedFile(input, user)
  }

  @Query(() => PresignedUrlResponse, { nullable: true })
  getPresignedUrl(
    @Args('input') input: GetPresignedUrlInput,
    @CurrentUser() user: User,
  ): Promise<PresignedUrlResponse> {
    return this.applicationService.presignedUrl(input, user)
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
