import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@ObjectType('AuthAdminTranslationEnvironmentData')
export class TranslationEnvironmentData {
  @Field(() => Environment)
  environment!: Environment

  @Field(() => String)
  language!: string

  @Field(() => String)
  className!: string

  @Field(() => String)
  property!: string

  @Field(() => String)
  key!: string

  @Field(() => String, { nullable: true })
  value?: string
}
