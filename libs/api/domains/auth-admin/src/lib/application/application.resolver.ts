import { UseGuards } from '@nestjs/common'
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { Environment } from '@island.is/shared/types'

import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { ApplicationsService } from './applications.service'
import { ApplicationsPayload } from './dto/applications-payload'
import { Application } from './models/application.model'
import { ApplicationEnvironment } from './models/applications-environment.model'
import { CreateApplicationInput } from './dto/createApplication.input'
import { ApplicationsInput } from './dto/applications.input'

@UseGuards(IdsUserGuard)
@Resolver(() => Application)
export class ApplicationResolver {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Query(() => ApplicationsPayload, { name: 'authAdminApplications' })
  getApplications(@Args('input') input: ApplicationsInput) {
    return this.applicationsService.getApplications(
      input.tenantId,
      input.applicationId,
    )
  }

  @Mutation(() => Application, { name: 'createAuthAdminApplication' })
  createApplication(
    @Args('input', { type: () => CreateApplicationInput })
    input: CreateApplicationInput,
  ) {
    return this.applicationsService.createApplication(input)
  }

  @ResolveField('defaultEnvironment', () => ApplicationEnvironment)
  resolveDefaultEnvironment(
    @Parent() application: Application,
  ): ApplicationEnvironment {
    if (application.environments.length === 0) {
      throw new Error(
        `Application ${application.applicationId} has no environments`,
      )
    }

    // Depends on the priority order being decided by the backend
    return application.environments[0]
  }

  @ResolveField('availableEnvironments', () => [Environment])
  resolveAvailableEnvironments(
    @Parent() application: Application,
  ): Environment[] {
    return application.environments.map((env) => env.environment)
  }
}
