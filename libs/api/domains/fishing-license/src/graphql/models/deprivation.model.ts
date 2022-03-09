import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Deprivation {
  @Field(() => Date, { nullable: true })
  validFrom?: Date
  @Field(() => Date, { nullable: true })
  invalidFrom?: Date
  @Field()
  explanation!: string
}
