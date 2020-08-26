import { Args, Query, Resolver, Mutation } from '@nestjs/graphql'
import { ApplicationService } from './application.service'
import { Application } from './application.model'
import { GetApplicationInput } from './dto/getApplication.input'
import { CreateApplicationInput } from './dto/createApplication.input'
import { UpdateApplicationInput } from './dto/updateApplication.input'
import { AddAttachmentInput } from './dto/addAttachment.input'
import { DeleteAttachmentInput } from './dto/deleteAttachment.input'

@Resolver()
export class ApplicationResolver {
  constructor(private applicationService: ApplicationService) {}

  @Query(() => Application, { nullable: true })
  getApplication(
    @Args('input') input: GetApplicationInput,
  ): Promise<Application | null> {
    return this.applicationService.findOne(input.id)
  }

  @Mutation(() => Application, { nullable: true })
  createApplication(
    @Args('input') input: CreateApplicationInput,
  ): Promise<Application> {
    return this.applicationService.create(input)
  }

  @Mutation(() => Application, { nullable: true })
  updateApplication(
    @Args('input') input: UpdateApplicationInput,
  ): Promise<Application> {
    return this.applicationService.update(input)
  }

  @Mutation(() => Application, { nullable: true })
  addAttachment(
    @Args('input') input: AddAttachmentInput,
  ): Promise<Application> {
    return this.applicationService.addAttachment(input)
  }

  @Mutation(() => Application, { nullable: true })
  deleteAttachment(
    @Args('input') input: DeleteAttachmentInput,
  ): Promise<Application> {
    return this.applicationService.deleteAttachment(input)
  }
}
