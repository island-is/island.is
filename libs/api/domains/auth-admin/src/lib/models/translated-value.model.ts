import { Field, InputType, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAdminTranslatedValue')
@InputType('AuthAdminTranslatedValueInput')
export class TranslatedValue {
  @Field(() => String)
  locale!: string

  @Field(() => String)
  value!: string
}
