import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ApplicationType } from '../../models/applicationType'
import { Environment } from '../../models/environment'

@ObjectType('AuthAdminApplication')
export class Application {
  @Field(() => ID)
  applicationId!: string

  @Field(() => ApplicationType)
  applicationType!: ApplicationType

  @Field(() => [Environment])
  environments!: Environment[]

  @Field(() => String)
  displayName!: string
}
