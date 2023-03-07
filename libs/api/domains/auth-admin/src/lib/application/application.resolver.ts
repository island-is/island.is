import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { Application } from './models/application.model'
import { ApplicationService } from './application.service'
import { CreateApplicationInput } from './dto/createApplication.input'

@UseGuards(IdsUserGuard)
@Resolver(() => Application)
export class ApplicationResolver {
  constructor(private readonly applicationService: ApplicationService) {}

  @Mutation(() => Application, { name: 'createAuthAdminApplication' })
  createClient(
    @Args('input', { type: () => CreateApplicationInput })
    input: CreateApplicationInput,
  ) {
    return this.applicationService.createClient(input)
  }
}
