import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PersonalTaxReturn {
  @Field(() => String)
  url!: string
}
