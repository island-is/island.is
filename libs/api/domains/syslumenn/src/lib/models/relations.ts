import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class EstateRelations {
  @Field(() => [String])
  relations!: string[]
}
