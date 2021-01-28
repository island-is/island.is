import { Args, Query, Resolver, Mutation } from '@nestjs/graphql'
import { ApplicationService } from './application.service'
import { Application } from './application.model'
import { GetApplicationsByTypeInput } from './dto/getApplicationsByType.input'
import { GetApplicationInput } from './dto/getApplication.input'
import { CreateApplicationInput } from './dto/createApplication.input'
import { UpdateApplicationInput } from './dto/updateApplication.input'
import { UpdateApplicationExternalDataInput } from './dto/updateApplicationExternalData.input'
import { AddAttachmentInput } from './dto/addAttachment.input'
import { DeleteAttachmentInput } from './dto/deleteAttachment.input'
import { SubmitApplicationInput } from './dto/submitApplication.input'
import { AssignApplicationInput } from './dto/assignApplication.input'
import { CreatePdfInput } from './dto/createPdf.input'
import {
  IdsAuthGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { ApplicationResponseDtoTypeIdEnum } from '../../gen/fetch'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Resolver()
export class ApplicationResolver {
  constructor(private applicationService: ApplicationService) {}

  @Query(() => Application, { nullable: true })
  async getApplication(
    @Args('input') input: GetApplicationInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.findOne(input.id, user.authorization)
  }

  @Query(() => [Application], { nullable: true })
  async getApplicationsByType(
    @Args('input') input: GetApplicationsByTypeInput,
    @CurrentUser() user: User,
  ): Promise<Application[] | null> {
    return this.applicationService.findAllByType(
      input.typeId,
      user.authorization,
    )
  }

  @Query(() => [Application], { nullable: true })
  async getApplicationsByApplicant(
    @CurrentUser() user: User,
    @Args('typeId', {
      type: () => ApplicationResponseDtoTypeIdEnum,
      nullable: true,
    })
    typeId?: ApplicationResponseDtoTypeIdEnum,
  ): Promise<Application[] | null> {
    return this.applicationService.findAllByApplicant(
      user.nationalId,
      user.authorization,
      typeId,
    )
  }

  @Query(() => [Application], { nullable: true })
  async getApplicationsByAssignee(
    @CurrentUser() user: User,
    @Args('typeId', {
      type: () => ApplicationResponseDtoTypeIdEnum,
      nullable: true,
    })
    typeId?: ApplicationResponseDtoTypeIdEnum,
  ): Promise<Application[] | null> {
    return this.applicationService.findAllByAssignee(
      user.nationalId,
      user.authorization,
      typeId,
    )
  }

  @Mutation(() => Application, { nullable: true })
  async createApplication(
    @Args('input') input: CreateApplicationInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.create(input, user.authorization)
  }

  @Mutation(() => Application, { nullable: true })
  async updateApplication(
    @Args('input') input: UpdateApplicationInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.update(input, user.authorization)
  }

  @Mutation(() => Application, { nullable: true })
  updateApplicationExternalData(
    @Args('input') input: UpdateApplicationExternalDataInput,
    @CurrentUser() user: User,
  ): Promise<Application | void> {
    return this.applicationService.updateExternalData(input, user.authorization)
  }

  @Mutation(() => Application, { nullable: true })
  async addAttachment(
    @Args('input') input: AddAttachmentInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.addAttachment(input, user.authorization)
  }

  @Mutation(() => Application, { nullable: true })
  async deleteAttachment(
    @Args('input') input: DeleteAttachmentInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.deleteAttachment(input, user.authorization)
  }

  @Mutation(() => Application, { nullable: true })
  async submitApplication(
    @Args('input') input: SubmitApplicationInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.submitApplication(input, user.authorization)
  }

  @Mutation(() => Application, { nullable: true })
  async assignApplication(
    @Args('input') input: AssignApplicationInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.assignApplication(input, user.authorization)
  }

  @Mutation(() => Application, { nullable: true })
  async createPdfPresignedUrl(
    @Args('input') input: CreatePdfInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.createPdfPresignedUrl(input, user.authorization)
  }
}
