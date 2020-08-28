import { Args, Query, Resolver, Mutation } from '@nestjs/graphql'
import { ApplicationService } from './application.service'
import { Application } from './application.model'
import { GetApplicationsByTypeInput } from './dto/getApplicationsByType.input'
import { GetApplicationInput } from './dto/getApplication.input'
import { CreateApplicationInput } from './dto/createApplication.input'
import { UpdateApplicationInput } from './dto/updateApplication.input'

@Resolver()
export class ApplicationResolver {
  constructor(private applicationService: ApplicationService) {}

  @Query(() => Application, { nullable: true })
  getApplication(
    @Args('input') input: GetApplicationInput,
  ): Promise<Application | null> {
    return this.applicationService.findOne(input.id)
  }

  @Query(() => [Application], { nullable: true })
  getApplicationsByType(
    @Args('input') input: GetApplicationsByTypeInput,
  ): Promise<Application[] | null> {
    return this.applicationService.findAllByType(input.typeId)
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
}
