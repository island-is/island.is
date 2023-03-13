import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Environment } from '@island.is/shared/types'
import { ApplicationEnvironment } from './applications-environment.model'
import { ApplicationType } from '../../models/applicationType'

@ObjectType('AuthAdminApplication')
export class Application {
  @Field(() => ID)
  applicationId!: string

  @Field(() => ApplicationType)
  applicationType!: ApplicationType

  @Field(() => [ApplicationEnvironment])
  environments!: ApplicationEnvironment[]

  @Field(() => ApplicationEnvironment)
  defaultEnvironment!: ApplicationEnvironment

  @Field(() => [Environment])
  availableEnvironments!: Environment[]
}
