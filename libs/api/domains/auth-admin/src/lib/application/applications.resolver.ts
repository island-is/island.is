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

import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { ApplicationsService } from './applications.service'
import { ApplicationsPayload } from './dto/applications-payload'
import { Application } from './models/application.model'
import { ApplicationEnvironment } from './models/applications-environment.model'
import { ApplicationsInput } from './dto/applications.input'
import { CreateApplicationResponseDto } from './dto/create-application-response'
import { CreateClientsInput } from './dto/createClientsInput'

@UseGuards(IdsUserGuard)
@Resolver(() => Application)
export class ApplicationsResolver {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Query(() => ApplicationsPayload, { name: 'authAdminApplications' })
  getApplications(@Args('tenantId') tenantId: string) {
    return this.applicationsService.getApplications(tenantId)
  }

  @Query(() => Application, { name: 'authAdminApplication' })
  getApplicationById(@Args('input') input: ApplicationsInput) {
    return this.applicationsService.getApplicationById(
      input.tenantId,
      input.applicationId,
    )
  }

  @Mutation(() => [CreateApplicationResponseDto], {
    name: 'createAuthAdminApplication',
  })
  createClient(
    @Args('input', { type: () => CreateClientsInput })
    input: CreateClientsInput,
    @CurrentUser() user: User,
  ) {
    return this.applicationsService.createApplication(input, user)
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
