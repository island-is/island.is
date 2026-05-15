import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@ObjectType('AuthAdminTranslationEnvironmentData')
export class TranslationEnvironmentData {
  @Field(() => Environment)
  environment!: Environment

  @Field(() => String, { nullable: true })
  value?: string
}
