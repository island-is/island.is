import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@ObjectType('AuthAdminLanguageEnvironmentData')
export class LanguageEnvironmentData {
  @Field(() => Environment)
  environment!: Environment

  @Field(() => String)
  isoKey!: string

  @Field(() => String)
  description!: string

  @Field(() => String)
  englishDescription!: string
}
