import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryCitizenship {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String)
  code!: string
}
