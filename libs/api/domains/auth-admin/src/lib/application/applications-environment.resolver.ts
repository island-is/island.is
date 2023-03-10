import { UseGuards } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { IdsUserGuard } from '@island.is/auth-nest-tools'

import { ApplicationEnvironment } from './models/applications-environment.model'

@UseGuards(IdsUserGuard)
@Resolver(() => ApplicationEnvironment)
export class ApplicationEnvironmentResolver {
  @ResolveField('id', () => String)
  resolveId(@Parent() application: ApplicationEnvironment) {
    return `${application.name}-${application.environment}`
  }
}
