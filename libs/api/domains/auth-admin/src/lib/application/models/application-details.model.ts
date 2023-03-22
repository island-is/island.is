import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ApplicationDetailsEnvironment } from './application-details-environment.model'

@ObjectType('AuthAdminApplicationDetails')
export class ApplicationDetails {
  @Field(() => ID)
  applicationId!: string
  @Field(() => String)
  tag!: string
  @Field(() => String)
  name!: string

  @Field(() => [ApplicationDetailsEnvironment])
  availableDetailsEnvironments!: ApplicationDetailsEnvironment[]
}
