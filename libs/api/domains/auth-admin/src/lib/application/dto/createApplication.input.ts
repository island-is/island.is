import { Field, InputType, ID } from '@nestjs/graphql'
import { ApplicationType } from '../../models/applicationType'
import { Environment } from '../../models/environment'

@InputType('CreateAuthAdminApplicationInput')
export class CreateApplicationInput {
  @Field(() => ID, { nullable: false })
  applicationId!: string

  @Field(() => ApplicationType, { nullable: false })
  applicationType!: ApplicationType

  @Field(() => [Environment], { nullable: false })
  environments!: Environment[]

  @Field(() => String, { nullable: false })
  displayName!: string
}
