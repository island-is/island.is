import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Seaworthiness {
  @Field(() => Date)
  validTo!: Date
}
