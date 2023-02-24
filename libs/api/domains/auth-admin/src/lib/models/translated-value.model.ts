import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAdminTranslatedValue')
export class TranslatedValue {
  @Field(() => String)
  locale!: string

  @Field(() => String)
  value!: string
}
