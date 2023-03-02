import { Field, ObjectType } from '@nestjs/graphql'
import { Environment } from '../../models/environment'

import { ApplicationEnvironment } from './applications-environment.model'

@ObjectType('AuthAdminApplication')
export class Application {
  @Field()
  applicationId!: string

  @Field()
  applicationType!: string

  @Field(() => [ApplicationEnvironment])
  environments!: ApplicationEnvironment[]

  @Field(() => ApplicationEnvironment)
  defaultEnvironment!: ApplicationEnvironment

  @Field(() => [Environment])
  availableEnvironments!: Environment[]
}
