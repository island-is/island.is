import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('DirectorateOfEqualityMutationResult')
export class MutationResult {
  @Field(() => Boolean)
  success!: boolean
}
