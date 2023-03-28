import { Field, InputType, ID } from '@nestjs/graphql'
import { Environment } from '@island.is/shared/types'
import { ApplicationType } from '../../models/applicationType'

@InputType('CreateAuthAdminApplicationInput')
export class CreateClientsInput {
  @Field(() => ID, { nullable: false })
  applicationId!: string

  @Field(() => ApplicationType, { nullable: false })
  applicationType!: ApplicationType

  @Field(() => [Environment], { nullable: false })
  environments!: Environment[]

  @Field(() => String, { nullable: false })
  displayName!: string

  @Field(() => ID, { nullable: false })
  tenantId!: string
}
