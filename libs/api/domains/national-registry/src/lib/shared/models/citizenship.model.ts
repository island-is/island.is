import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType('NationalRegistryCitizenship')
export class Citizenship {
  @Field(() => ID)
  code!: string

  @Field(() => String)
  name!: string
}
