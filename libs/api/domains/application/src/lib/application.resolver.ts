import { Args, Query, Resolver, Mutation } from '@nestjs/graphql'
import { ApplicationService } from './application.service'
import { Application } from './application.model'
import { GetApplicationInput } from './dto/getApplication.input'
import { CreateApplicationInput } from './dto/createApplication.input'

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
}
