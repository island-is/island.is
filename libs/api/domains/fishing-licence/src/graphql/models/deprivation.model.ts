import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Deprivation {
  @Field(() => Date)
  validFrom!: Date
  @Field(() => Date)
  invalidFrom!: Date
  @Field()
  explanation!: string
}
